-- CreateTable
CREATE TABLE `Negocios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `whatsappNumber` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `googleMapsLink` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
