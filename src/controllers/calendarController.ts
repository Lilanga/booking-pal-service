import { getGoogleCalendar } from "../lib/gcal";
import { CalendarEvent } from "../lib/gcal/types";

// const { calendar_id } = await readConfiguration();
// const googleCalendar = new GoogleCalendar(calendar_id);
// const calendarClient = await googleCalendar.authorize();

const getEvents = async (
    { params: { calendarId } }: { params: { calendarId: string } },
): Promise<CalendarEvent[]> => {
  const googleCalendar = await getGoogleCalendar(calendarId);
  const events = await googleCalendar.calendarClient.getEvents();
  return events;
};

const getCurrentEverntItem = async (
    { params: { calendarId } }: { params: { calendarId: string } },
): Promise<CalendarEvent | {}> => {
  const googleCalendar = await getGoogleCalendar(calendarId);
  const event = await googleCalendar.calendarClient.currentEvent();
  return event;
};

const createEvent = async (
  { params: { calendarId, duration } }: { params: { calendarId: string, duration?: string } },
): Promise<CalendarEvent[]> => {
  const googleCalendar = await getGoogleCalendar(calendarId);
  const events = await googleCalendar.calendarClient.createEvent(parseInt(duration || "15"));
  return events;
};

const completeEvent = async (
  { params: { calendarId, eventId } }: { params: { calendarId: string, eventId: string } },
): Promise<CalendarEvent[]> => {
  const googleCalendar = await getGoogleCalendar(calendarId);
  const events = await googleCalendar.calendarClient.CompleteEvent(eventId);
  return events;
};

export const getAllEvents = {
  method: getEvents,
  description: {
    detail: {
      tags: ["calendar"],
      summary: "Get all calendar events",
      description: "Get all calendar events for the given calendar",
    },
  },
};

export const getCurrentEvent = {
  method: getCurrentEverntItem,
  description: {
    detail: {
      tags: ["calendar"],
      summary: "Get current calendar event",
      description: "Get current calendar event for the given calendar",
    },
  },
};

export const createCalendarEvent = {
  method: createEvent,
  description: {
    detail: {
      tags: ["calendar"],
      summary: "Create calendar event",
      description:
        "Create a calendar event with given duration. Default duration is 15 minutes.",
    },
  },
};

export const completeCalendarEvent = {
  method: completeEvent,
  description: {
    detail: {
      tags: ["calendar"],
      summary: "Complete calendar event",
      description: "Complete the calendar event with given eventId.",
    },
  },
};
