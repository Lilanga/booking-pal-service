-- CreateTable
CREATE TABLE "CalendarDetails" (
    "calendarID" TEXT NOT NULL,
    "calendarName" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "credentialsID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CalendarCredentials" (
    "id" SERIAL NOT NULL,
    "clientSecret" JSONB NOT NULL,
    "authToken" TEXT NOT NULL,
    "appToken" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalendarDetails_calendarID_key" ON "CalendarDetails"("calendarID");

-- AddForeignKey
ALTER TABLE "CalendarDetails" ADD CONSTRAINT "CalendarDetails_credentialsID_fkey" FOREIGN KEY ("credentialsID") REFERENCES "CalendarCredentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
