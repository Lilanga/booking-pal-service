import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as googleAuth from "google-auth-library";

const CREDENTIALS_DIR = path.resolve(__dirname, "./credentials");
const CONFIG_DIR = path.resolve(__dirname, "./config");
const API_TOKEN = path.resolve(CREDENTIALS_DIR, "token.json");
const RUNTIME_TOKEN = path.resolve(CREDENTIALS_DIR, "dynamic_app_token.json");
const GOOGLE_CLIENT_SECRET = path.resolve(CONFIG_DIR, "client_secret.json");
const CALENDAR_CONFIG = path.resolve(CONFIG_DIR, "calendar.json");

function readCredentials(): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(GOOGLE_CLIENT_SECRET, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(content.toString()));
      }
    });
  });
}

function askForOauthToken(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the obtained API token: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function oauth2TokenInstructions(
  oauth2Client: googleAuth.OAuth2Client,
): Promise<string> {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  console.log(
    "Authorize Booking Pal to access your calendar by visiting this URL: ",
    authUrl,
  );

  return askForOauthToken().then((token) => {
    createDirectory(CREDENTIALS_DIR);
    return new Promise<string>((resolve, reject) => {
      fs.writeFile(API_TOKEN, token, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  });
}

function createDirectory(directory: string): void {
  try {
    fs.mkdirSync(directory);
  } catch (err: any) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

function storeToken(token: any): void {
  createDirectory(CREDENTIALS_DIR);
  fs.writeFile(RUNTIME_TOKEN, JSON.stringify(token), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function getAccessToken(
  client: googleAuth.OAuth2Client,
  codebuffer: Buffer,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const code = codebuffer.toString();
    client.getToken(code, (err: Error | null, token: any) => {
      if (err) {
        console.log(
          "Error while trying to retrieve access token with code",
          code,
          err,
        );
        return reject(err);
      }

      storeToken(token);
      resolve(token);
    });
  });
}

function readOauth2Token(oauth2Client: googleAuth.OAuth2Client): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(RUNTIME_TOKEN, (err, tokenBuffer) => {
      if (err) {
        fs.readFile(API_TOKEN, (err, codeBuffer) => {
          if (err) {
            return oauth2TokenInstructions(oauth2Client)
              .then((code) => getAccessToken(oauth2Client, Buffer.from(code)))
              .then((token) => resolve(token))
              .catch((error) => reject(error));
          } else {
            getAccessToken(oauth2Client, codeBuffer)
              .then((token) => resolve(token))
              .catch((error) => reject(error));
          }
        });
      } else {
        resolve(JSON.parse(tokenBuffer.toString()));
      }
    });
  });
}

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

export { readConfiguration, readCredentials, readOauth2Token };
