/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Negocios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Negocios" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'examples@example.com';

-- CreateIndex
CREATE UNIQUE INDEX "Negocios_email_key" ON "Negocios"("email");
