import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import {
  completeCalendarEvent,
  createCalendarEvent,
  getAllEvents,
  getCurrentEvent,
} from "./controllers/calendarController";
import { updateCalendarCredentialsAuthToken } from "./controllers/authController";
import { verifyApiToken } from "./lib/auth";
import { getCalendarDetailWithCredentials } from "./lib/db";
import { ApiAuthError } from "./controllers/types";
const swaggerDocument = require("../swaggerDoc.json");

const app = new Elysia().use(swagger(swaggerDocument));

app
  .error({ API_AUTH_ERROR: ApiAuthError })
  .onError(({ code, error }) => {
    if (code === "API_AUTH_ERROR") {
      return new Response(error.message, {
        status: error.status,
      });
    }
  });

app.group("/api/v1/calendar/:calendarId", (app) =>
  app
    .get("/events", getAllEvents.method, getAllEvents.hooks)
    .get("/currentEvent", getCurrentEvent.method, getCurrentEvent.hooks)
    .post(
      "/createEvent/:duration",
      createCalendarEvent.method,
      createCalendarEvent.hooks,
    )
    .put(
      "/completeEvent/:eventId",
      completeCalendarEvent.method,
      completeCalendarEvent.hooks,
    ));

app.get(
  "/oauth2callback",
  updateCalendarCredentialsAuthToken.method,
  updateCalendarCredentialsAuthToken.description,
);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🦊 Booking-Pal service is running at ${app.server?.port}`);
});
