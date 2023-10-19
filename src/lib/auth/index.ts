import { getCalendarDetailWithCredentials } from "../db";

const TOKEN_HEADER = "x-api-key";

export async function verifyApiToken({ store, set, params: { calendarId }, request: { headers } }: { store: any, set: any, params: { calendarId?: string }, request: { headers:any } }) {
    const apiKey = headers[TOKEN_HEADER];
    const calendarID = decodeURIComponent(calendarId ?? "");

    const calendarDetailsWithCredentials =  await getCalendarDetailWithCredentials(calendarID, apiKey);

    if (!calendarDetailsWithCredentials) {
        set.status = 401;
        set.body = "Unauthorized";
        return false;
    }

    store.calendarDetails = calendarDetailsWithCredentials;
    return true;
}