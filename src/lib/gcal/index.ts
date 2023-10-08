import * as googleAuth from "google-auth-library";
import { CalendarClient } from "./calendarClient";
import { readCredentials, readOauth2Token } from "./calendarUtils";

let _calendarId: string;

export class GoogleCalendar {
  constructor(calendarId: string) {
    _calendarId = calendarId;
  }

  async authorize(): Promise<CalendarClient> {
    try {
      const credentials = await readCredentials();
      const clientSecret = credentials.installed.client_secret;
      const clientId = credentials.installed.client_id;
      const redirectUrl = credentials.installed.redirect_uris[0];
      const oauth2Client = new googleAuth.OAuth2Client(
        clientId,
        clientSecret,
        redirectUrl,
      );

      const token = await readOauth2Token(oauth2Client);
      oauth2Client.credentials = token;

      return new CalendarClient(_calendarId, oauth2Client);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
