/*
  Warnings:

  - You are about to drop the column `appToken` on the `CalendarCredentials` table. All the data in the column will be lost.
  - You are about to drop the column `authToken` on the `CalendarCredentials` table. All the data in the column will be lost.
  - You are about to drop the column `clientSecret` on the `CalendarCredentials` table. All the data in the column will be lost.
  - Added the required column `serviceAccountKey` to the `CalendarCredentials` table without a default value. This is not possible if the table is not empty.

*/
-- TRUNCATE table data
TRUNCATE "CalendarCredentials" CASCADE;

-- AlterTable
ALTER TABLE "CalendarCredentials" DROP COLUMN "appToken",
DROP COLUMN "authToken",
DROP COLUMN "clientSecret",
ADD COLUMN     "serviceAccountKey" JSONB NOT NULL;
