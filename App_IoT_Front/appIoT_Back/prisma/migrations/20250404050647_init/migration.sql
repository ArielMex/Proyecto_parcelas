-- CreateTable
CREATE TABLE `GeneralSensorData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `humidity` DOUBLE NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `rain` DOUBLE NOT NULL,
    `sunIntensity` DOUBLE NOT NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
