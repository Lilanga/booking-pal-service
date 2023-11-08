import { google } from "googleapis";
import { CalendarEvent, Event } from "./types";

let calendar = google.calendar("v3");
const MILLISECONDS_PER_MINUTE = 60000;
let _auth: any, _calendarID: string;

class CalendarClient {
  constructor(calendarID: string, auth: any) {
    _calendarID = calendarID;
    _auth = auth;
    calendar = google.calendar({version: "v3", auth:_auth});
  }

  async getEvents(): Promise<CalendarEvent[]> {
    const timeMin = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date().setHours(23, 59, 59)).toISOString();
    return new Promise<CalendarEvent[]>((resolve, reject) => {
      calendar.events.list({
        calendarId: _calendarID,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
      }, (err: any, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.data.items);
        }
      });
    });
  }

  async createEvent(duration = 15): Promise<CalendarEvent[]> {
    const now = new Date();
    return new Promise((resolve, reject) => {
      const resource: Event = {
        summary: `Quick Reservation ${duration}'`,
        description: `Quick Reservation ${duration}'`,
        start: {
          dateTime: now.toISOString(),
        },
        end: {
          dateTime: new Date(now.getTime() + duration * MILLISECONDS_PER_MINUTE)
            .toISOString(),
        },
      };
      calendar.events.insert({
        auth: _auth,
        calendarId: _calendarID,
        requestBody: resource,
      }, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.getEvents());
        }
      });
    });
  }

  async CompleteEvent(eventId: string): Promise<CalendarEvent[]> {
    const now = new Date();
    return new Promise((resolve, reject) => {
      const resource: Event = {
        end: {
          dateTime: now.toISOString(),
        },
      };
      calendar.events.patch({
        auth: _auth,
        calendarId: _calendarID,
        eventId,
        requestBody: resource,
      }, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.getEvents());
        }
      });
    });
  }

  async currentEvent(): Promise<CalendarEvent | {}> {
    const now = new Date().getTime();
    return this.getEvents()
      .then((events) => {
        const item = events.find((e) => {
          const start = e.start?.dateTime
            ? new Date(e.start.dateTime).getTime()
            : undefined;
          const end = e.end?.dateTime
            ? new Date(e.end.dateTime).getTime()
            : undefined;
          if (start && end) {
            if (now > start && now < end) {
              return true;
            }
            if (now < start) {
              return true;
            }
          }
          return false;
        }) || null;
        return item || {};
      });
  }
}

export { CalendarClient };
