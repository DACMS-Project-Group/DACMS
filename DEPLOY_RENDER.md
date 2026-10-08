# Deploy DACMS to Render

This repository is configured as a Render Blueprint. It deploys the React
frontend and Express/Socket.IO backend together as one web service, and creates
a separate managed PostgreSQL database. Serving both app and API from one
origin keeps authentication cookies and live notifications working without
cross-origin configuration.

## What Render creates

- `dacms-web`: Docker-based web service. It builds the Vite frontend, runs the
  Express API and Socket.IO server, and installs Chromium for PDF exports.
- `dacms-db`: managed PostgreSQL database, connected to the app using its
  private Render connection string.
- A 1 GB persistent disk mounted at `/app/backend/documents` for uploaded
  supporting documents.

The web service and database use Render paid plans; persistent disks are not
available on free web instances. Review Render's current pricing before
creating the Blueprint.

## Deploy

1. Push this repository to GitHub or GitLab.
2. In Render, choose **New + → Blueprint** and connect the repository.
3. Review the resources from `render.yaml`, choose the appropriate region and
   plans, and apply the Blueprint.
4. Wait for the first build and deploy to finish. The service health check is
   available at `/healthz`.
5. In the Render dashboard, open the `dacms-web` service and choose **Shell**.
   Run the following commands from the **web service shell** so they use the
   same `DATABASE_URL` as the running backend. First check whether the DACMS
   tables already exist:

   ```sh
   psql "$DATABASE_URL" -c '\dt'
   ```

   If the database is new and the DACMS tables are absent, initialize it once:

   ```sh
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f /app/backend/init.sql
   ```

   Verify that initialization created the tables:

   ```sh
   psql "$DATABASE_URL" -c '\dt'
   ```

   The login error `relation "APP_USER" does not exist` means the connected
   database has not been initialized with the DACMS schema. If `\dt` shows no
   DACMS tables, initialize that database using the command above. The database
   name in Render may differ from the configured base name; using
   `"$DATABASE_URL"` ensures the command targets the same database as the app.

   **Important:** `backend/init.sql` drops existing DACMS tables before
   recreating them and inserts bundled seed data. Run it only against a new,
   empty database. Do not run it on a database containing data, because it will
   erase those tables and records. Review the seeded demo/test records and
   replace them before opening the application to real users.

6. Open the service URL shown in the Render dashboard and test registration,
   login, document uploads, notifications, and PDF export.

## Configuration and operations

- Render generates `JWT_SECRET` through the Blueprint. Keep it private and do
  not rotate it casually: existing login cookies become invalid when it
  changes.
- `backend/.env` was previously tracked in this repository and has now been
  removed from the current tree. If it contained credentials, rotate them
  before deployment; removing a file does not erase it from earlier Git
  history.
- `DATABASE_URL` is supplied by the managed database resource. Locally, the
  backend can still use the individual `POSTGRES_*` variables.
- Uploaded files are stored on the persistent disk. Back up important uploads
  separately; a disk is not a substitute for backups.
- Email notifications still use the application's Ethereal test-mail
  mechanism. They are previews, not normal user email delivery.
- Create database backups before schema changes. The current `init.sql` is a
  destructive development/bootstrap script, not a migration tool.
- The Render web service serves the frontend, API, and Socket.IO on the same
  hostname. Do not deploy the frontend as a separate static site without first
  configuring its API URL, credentialed CORS, cookie policy, and Socket.IO
  origin for that architecture.

## Local development remains unchanged

The existing Docker Compose setup still runs PostgreSQL as its own service.
Start the local stack with:

```sh
docker compose up --build
```

Copy `.env.example` to `backend/.env` if you need local environment overrides.
Never commit `.env` files or put production secrets in the repository.
