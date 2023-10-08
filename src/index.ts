import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import {
  completeCalendarEvent,
  createCalendarEvent,
  getAllEvents,
  getCurrentEvent,
} from "./controllers/calendarController";
const swaggerDocument = require("../swaggerDoc.json");

const app = new Elysia().use(swagger(swaggerDocument));

app.group("/api/v1", (app) =>
  app
    .get("/events", getAllEvents.method, getAllEvents.description)
    .get("/currentEvent", getCurrentEvent.method, getCurrentEvent.description)
    .post("/createEvent/:duration", createCalendarEvent.method, createCalendarEvent.description)
    .put("/completeEvent/:eventId", completeCalendarEvent.method, completeCalendarEvent.description)
  );
    

app.listen(process.env.PORT || 3000, () => {
  console.log(`🦊 Booking-Pal service is running at ${app.server?.port}`);
});
