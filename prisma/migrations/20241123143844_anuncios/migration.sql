-- CreateTable
CREATE TABLE "Anuncios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "description" TEXT NOT NULL,
    "phone" TEXT,
    "category" TEXT,
    "contact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anuncios_pkey" PRIMARY KEY ("id")
);
