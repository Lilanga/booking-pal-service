import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as googleAuth from "google-auth-library";
import { CalendarClient } from "./calendarClient";
import { getCalendarCredentials, updateCalendarCredentials } from "../db";
import {
  GoogleAppToken,
  GoogleCalendarCredentials,
  GoogleClientSecret,
} from "./types";
import { ApiTokenExpiredError } from "../../controllers/types";

const CONFIG_DIR = path.resolve(import.meta.dir, "./config");
const CALENDAR_CONFIG = path.resolve(CONFIG_DIR, "calendar.json");

function readConfigurationFile(): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(CALENDAR_CONFIG, (error, content) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(content.toString()));
      }
    });
  });
}

function writeConfiguration(calendar_id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const configuration = { calendar_id, title: "" };

    fs.writeFile(CALENDAR_CONFIG, JSON.stringify(configuration), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(configuration);
      }
    });
  });
}

function askForCalendarId(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Enter the calendar ID (found on the settings page of your calendar in Google Calendar): ",
      (answer) => {
        rl.close();
        resolve(answer);
      },
    );
  });
}

function readConfiguration(): Promise<any> {
  return new Promise((resolve, reject) => {
    readConfigurationFile()
      .then((configuration) => resolve(configuration))
      .catch((error) => {
        if (error.code !== "ENOENT") {
          reject(error);
        } else {
          askForCalendarId()
            .then(writeConfiguration)
            .then((configuration) => resolve(configuration))
            .catch((error) => reject(error));
        }
      });
  });
}

function getAuth2TokenInstructions(
  oauth2Client: googleAuth.OAuth2Client,
  credentialsId: number,
): string {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    redirect_uri: process.env.SERVICE_URL + "/oauth2callback",
    state: credentialsId.toString(),
  })
}

function fetchAccessToken(
  client: googleAuth.OAuth2Client,
  code: string,
): Promise<GoogleAppToken> {
  return new Promise((resolve, reject) => {
    client.getToken(code, (err: Error | null, token?: googleAuth.Credentials | null) => {
      if (err) {
        console.log(
          "Error while trying to retrieve access token with code",
          code,
          err,
        );
        return reject(err);
      }
      resolve(token as GoogleAppToken);
    });
  });
}

function getOauth2Token(
  oauth2Client: googleAuth.OAuth2Client,
  calendarCredentials: GoogleCalendarCredentials,
): Promise<GoogleAppToken> {
  const appToken = calendarCredentials?.appToken as unknown as GoogleAppToken;
  if (appToken && appToken.expiry_date > Date.now()) {
    return Promise.resolve(appToken);
  }

  return new Promise((resolve, reject) => {
    // fetch new token if expired and update the db
    fetchAccessToken(oauth2Client, calendarCredentials?.authToken)
      .then((token) => {
        updateCalendarCredentials(calendarCredentials?.id, token).then(() => {
          
        resolve(token);
      }).catch((error) => { reject(error); });
      })
      .catch((_error) => {
        const tokenError = new ApiTokenExpiredError(decodeURIComponent(getAuth2TokenInstructions(oauth2Client,calendarCredentials.id)), 412);
        reject(tokenError);
      }); //TODO: check error and handle to update token in db if expired, and then resolve. REF: oauth2TokenInstructions
  });
}

async function getOAuthClientByCalendarId(
  calendarId: string,
): Promise<CalendarClient> {
  const calendarCredentials = await getCalendarCredentials(calendarId);
  const credentials = calendarCredentials
    ?.clientSecret as unknown as GoogleClientSecret;
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];
  const oauth2Client = new googleAuth.OAuth2Client(
    clientId,
    clientSecret,
    redirectUrl,
  );

  const token = await getOauth2Token(oauth2Client, calendarCredentials as unknown as GoogleCalendarCredentials);
    oauth2Client.credentials = token;

  return new CalendarClient(calendarId, oauth2Client);
}

export {
  getOAuthClientByCalendarId,
  readConfiguration,
};
