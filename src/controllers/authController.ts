import { updateCalendarAuthToken } from "../lib/db/dbHelper";

const updateCalendarCredentialsToken = async (
  { query: { code, state } }: { query: { code?: string; state?: string } },
): Promise<void> => {
  console.log(`Updating token for calendar ${state} with code ${code}`);
  await updateCalendarAuthToken(state ? +state : -1, code || "");
  console.log("Token updated successfully");
};

export const updateCalendarCredentialsAuthToken = {
  method: updateCalendarCredentialsToken,
  description: {
    detail: {
      security: [],
      tags: ["auth"],
      summary: "Update the auth token of a given calendar",
      description: "Update the auth token of a given calendar credentials",
    },
  },
};
