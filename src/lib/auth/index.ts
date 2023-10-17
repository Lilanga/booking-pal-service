const TOKEN_HEADER = "x-api-key";

export async function verifyApiToken({ params: { calendarId }, headers }: { params: { calendarId: string }, headers: any }) {
    console.log("Token: "+headers[TOKEN_HEADER]+" recieved for CalendarId: "+calendarId);
}