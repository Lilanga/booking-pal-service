import * as googleAuth from "google-auth-library";
import { CalendarClient } from "./calendarClient";
import { getOAuthClientByCalendarId } from "./calendarUtils";
import { getCalendarCredentials } from "../db/dbHelper";
import { GoogleClientSecret } from "./types";

let _calendarId: string;

export class GoogleCalendar {
  constructor(calendarId: string) {
    _calendarId = calendarId;
  }

  async authorize(): Promise<CalendarClient> {
    try {
      const calendarClient = await getOAuthClientByCalendarId(_calendarId);
      return calendarClient;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
