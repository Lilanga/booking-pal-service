import { calendar_v3 } from "googleapis";
import { AllDayEvent, Event } from "./types";

const processEvents = (events: Event[]) => {
  const allDayEvents = markAllDayEvents(events);
  const confirmedEvents = removeUnconfirmedEvents(allDayEvents);
  return confirmedEvents;
};

const markAllDayEvents = (events: Event[]): AllDayEvent[] => {
  return events?.map((event) => {
    if (event?.start?.dateTime) {
      return {
        ...event,
        isAllDay: false,
      };
    } else { // all day events received from api call don't have the dateTime field
      const start = new Date(event?.start?.date || 0);
      start.setHours(0);
      const end = new Date(event?.end?.date || 0);
      end.setHours(0);
      return {
        ...event,
        start: { ...event.start, dateTime: start },
        end: { ...event.end, dateTime: end },
        isAllDay: true,
      };
    }
  });
};

const removeUnconfirmedEvents = (events: AllDayEvent[]) => {
  return events?.filter((event) => {
    return event.status === "confirmed";
  });
};

export { processEvents };
