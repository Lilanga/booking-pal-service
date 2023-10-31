import { CalendarClient } from "./calendarClient";
import { getOAuthClientByCalendarId } from "./calendarUtils";

export class GoogleCalendar {
  calendarId: string;
  calendarClient: CalendarClient;

  constructor(calendarId: string) {
    this.calendarId = calendarId;
    this.calendarClient = undefined as unknown as CalendarClient;
  }

  async authorize(): Promise<CalendarClient> {
    try {
      this.calendarClient = await getOAuthClientByCalendarId(this.calendarId);
      return this.calendarClient;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export async function getGoogleCalendar(calendarId: string): Promise<GoogleCalendar> {

  const calendarClient = new GoogleCalendar(decodeURIComponent(calendarId));
  await calendarClient.authorize();
  return calendarClient;
}