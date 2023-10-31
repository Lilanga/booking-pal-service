import {
  CalendarCredentials,
  CalendarDetails,
  PrismaClient,
} from "@prisma/client";
import { GoogleAppToken } from "../gcal/types";
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
  appToken: GoogleAppToken,
): Promise<CalendarCredentials | null> {
  const updatedCalendar = await prisma.calendarCredentials.update({
    where: {
      id: credentialID,
    },
    data: {
      appToken: appToken as unknown as any,
    },
  });
  return updatedCalendar;
}

export async function updateCalendarAuthToken(
  credentialID: number,
  authToken: string,
): Promise<CalendarCredentials | null> {
  const updatedCalendar = await prisma.calendarCredentials.update({
    where: {
      id: credentialID,
    },
    data: {
      authToken: authToken,
    },
  });
  return updatedCalendar;
}