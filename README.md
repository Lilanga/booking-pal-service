# Booking Pal Service

Booking pal service is a web service that allows booking pal IoT clients to connect and manage their room calendars.

## Configurations

Project is in initial stages and is not added proper configuration approaches. However, You can add your authorised google credentials json manually and add the nessasary configuration as below.

Follow Google's guide to obtain the OAuth JSON file and store it in `src/lib/gcal/config/client_secret.json` before starting the project.

You will be asked to enter the calendar ID (the calendar ID can be found on the settings page of your calendar in Google Calendar)

Open the link printed in the terminal, login with the same user as before to obtain the OAuth JSON file and authorize the app to access Google's API. You now get a token from the browser URLs query parameter. Enter that token in the terminal's prompt.

### Environment Variables

| Name | Description | Default Value |
|------|-------------|---------------|
| `PORT` | The port to run the server on | `3000` |

## Getting Started

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
