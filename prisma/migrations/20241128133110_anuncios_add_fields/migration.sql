/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Anuncios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Anuncios" ADD COLUMN     "city" TEXT,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'example@example.com',
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- CreateIndex
CREATE UNIQUE INDEX "Anuncios_email_key" ON "Anuncios"("email");
