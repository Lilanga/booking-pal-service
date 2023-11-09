# Booking Pal Service

Booking pal service is a REST web service that allows booking pal IoT clients to connect and manage their room calendars.

## Configurations

This service is using service account key to connect to Google Calendar API. Each calendar should have its own service account key. The service account key should be placed in `calendarCredentials` database table. The service account key should be in JSON format and stored in the `serviceAccountKey` column. Calendar Details table should have correct mapping to the valid calendar credentials.

To configure the service account for google calendar API, follow the steps below:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to [Google Calendar API](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com)
4. Enable the API
5. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
6. Create a new service account
7. Download the service account key in JSON format
8. Store the service account key in `calendarCredentials` database table

> You may need to share your calendar with the service account email address.

Also, get the calendar ID from your calendar settings and store it in the `calendarDetails` database table.

Please refer to this documentation on how to configure the service account key: [https://developers.google.com/identity/protocols/oauth2/service-account](https://developers.google.com/identity/protocols/oauth2/service-account)

### Database

Database has two configuration tables:

1. `calendarCredentials` - This table stores the service account key for each calendar or set of calendars. The service account key should be in JSON format and stored in the `serviceAccountKey` column.
2. `calendarDetails` - This table stores the calendar details. The calendar ID should be stored in the `calendarId` column. The `calendarCredentialsId` column should be mapped to the correct `calendarCredentials` table row. The `calendarName` column should be the name of the calendar. `apiKey` column should be the API key for the calendar. API key is used to authenticate the IoT client to the valid calendar.

### Environment Variables

| Name | Description | Default Value |
|------|-------------|---------------|
| `PORT` | The port to run the server on | `3000` |
| `DATABASE_URL` | The database connection string | `postgres://postgres:postgres@localhost:5432/booking-pal` |

## Project Structure

This is created using [Bun](https://bun.sh/) and [Elysia](https://elysia.to/). To get started, install bun globally:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then install the dependencies:

```bash
 bun install
```

Then run the server:

```bash
bun run start
```

## Development

To start the development server run:

```bash
bun run dev
```

Open <http://localhost:3000/> with your browser to see the result.

Elysia is a hot-reloading server, so any changes you make to the code will be reflected in the browser immediately.

Also service is configured with swagger, so you can access the swagger UI at <http://localhost:3000/swagger> to see the API documentation.
