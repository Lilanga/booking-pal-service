import { getGoogleCalendar } from "../lib/gcal";
import { CalendarEvent } from "../lib/gcal/types";
import { APIContext } from "./types";
import { validateApiKey } from "../utils/controllerUtils";

const getAllCalendarEvents = async (
    context: APIContext,
): Promise<CalendarEvent[] | string> => {
  await validateApiKey(context);
  const googleCalendar = await getGoogleCalendar(context.params.calendarId ?? "");
  const events = await googleCalendar.calendarClient.getEvents();
  return events;
};

const getCurrentEverntItem = async (
  context: APIContext,
): Promise<CalendarEvent | {}> => {
  await validateApiKey(context);
  const googleCalendar = await getGoogleCalendar(context.params.calendarId ?? "");
  const event = await googleCalendar.calendarClient.currentEvent();
  return event;
};

const createEvent = async (
  context: APIContext,
): Promise<CalendarEvent[]> => {
  await validateApiKey(context);
  const googleCalendar = await getGoogleCalendar(context.params.calendarId ?? "");
  const events = await googleCalendar.calendarClient.createEvent(parseInt(context.params.duration || "15"));
  return events;
};

const completeEvent = async (
  context: APIContext,
): Promise<CalendarEvent[]> => {
  await validateApiKey(context);
  const googleCalendar = await getGoogleCalendar(context.params.calendarId?? "");
  const events = await googleCalendar.calendarClient.CompleteEvent(context.params.eventId ?? "");
  return events;
};

export const getAllEvents = {
  method: getAllCalendarEvents,
  hooks: {
    detail: {
      tags: ["calendar"],
      summary: "Get all calendar events",
      description: "Get all calendar events for the given calendar",
    },
  },
};

export const getCurrentEvent = {
  method: getCurrentEverntItem,
  hooks: {
    detail: {
      tags: ["calendar"],
      summary: "Get current calendar event",
      description: "Get current calendar event for the given calendar",
    },
  },
};

export const createCalendarEvent = {
  method: createEvent,
  hooks: {
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
  hooks: {
    detail: {
      tags: ["calendar"],
      summary: "Complete calendar event",
      description: "Complete the calendar event with given eventId.",
    },
  },
};
