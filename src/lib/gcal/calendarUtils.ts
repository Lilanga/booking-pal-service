import { CalendarClient } from "./calendarClient";
import { getCalendarCredentials } from "../db";
import {
  ServiceAccountKey,
} from "./types";
import { google } from "googleapis";

async function getOAuthClientByCalendarId(
  calendarId: string,
): Promise<CalendarClient> {
  const calendarCredentials = await getCalendarCredentials(calendarId);
  const serviceAccountKey = calendarCredentials?.serviceAccountKey as unknown as ServiceAccountKey;

  const jwtClient = new google.auth.JWT(
    serviceAccountKey.client_email,
    undefined,
    serviceAccountKey.private_key,
    ['https://www.googleapis.com/auth/calendar'],
  );

  return new CalendarClient(calendarId, jwtClient);
}

export {
  getOAuthClientByCalendarId,
};
