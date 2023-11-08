import {
  CalendarCredentials,
  CalendarDetails,
} from "@prisma/client";
import { PrismaClient } from "./client";
import { ServiceAccountKey } from "../gcal/types";
const prisma = new PrismaClient();

export async function getCalendarDetail(
  calendarId: string,
): Promise<CalendarDetails | null> {
  const calendar = await prisma.calendarDetails.findUnique({
    where: {
      calendarID: calendarId,
    },
  });
  return calendar;
}

export async function getCalendarDetailWithCredentials(
  calendarId: string,
  apiKey: string,
): Promise<CalendarDetails | null> {
  const calendar = await prisma.calendarDetails.findUnique({
    where: {
      calendarID: calendarId,
      apiKey: apiKey,
    },
    include: {
      credential: true,
    },
  });
  return calendar;
}

export async function getCalendarCredentials(
  calendarId: string,
): Promise< CalendarCredentials | null> {
  const calendar = await prisma.calendarDetails.findUnique({
    where: {
      calendarID: calendarId,
    },
    include: {
      credential: true,
    },
  });
  const credentials = calendar?.credential as CalendarCredentials | null;
  return credentials;
}

export async function updateCalendarCredentials(
  credentialID: number,
  serviceKey: ServiceAccountKey,
): Promise<CalendarCredentials | null> {
  const updatedCalendar = await prisma.calendarCredentials.update({
    where: {
      id: credentialID,
    },
    data: {
      serviceAccountKey: serviceKey as unknown as any,
    },
  });
  return updatedCalendar;
}
