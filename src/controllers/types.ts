import { Context } from "elysia";

export type APIContext = Omit<Context, "params"> & {
    params: {
        calendarId?: string;
        duration?: string;
        eventId?: string;
    };
};

export class ApiAuthError extends Error {
    constructor(
      readonly message: string,
      readonly status: number = 401,
    ) {
      super(message)
      this.status = status
    }
  }

export class ApiTokenExpiredError extends Error {
    constructor(
      readonly message: string,
      readonly status: number = 412,
    ) {
      super(message)
      this.status = status
    }
  }
