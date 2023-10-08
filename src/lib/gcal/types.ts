import { calendar_v3 } from "googleapis";

export interface Event extends calendar_v3.Schema$Event {
}

export interface AllDayEvent extends Omit<Event, "start" | "end"> {
  isAllDay: boolean;
  start?: any;
  end?: any;
}

export interface CalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  creator: Creator;
  organizer: Organizer;
  start: Start;
  end: End;
  iCalUID: string;
  sequence: number;
  reminders: Reminders;
  eventType: string;
}

export interface Creator {
  email: string;
}

export interface Organizer {
  email: string;
  displayName: string;
  self: boolean;
}

export interface Start {
  dateTime: string;
  timeZone: string;
}

export interface End {
  dateTime: string;
  timeZone: string;
}

export interface Reminders {
  useDefault: boolean;
}
