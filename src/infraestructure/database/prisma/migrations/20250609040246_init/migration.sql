-- CreateTable
CREATE TABLE `fused_character` (
    `id` VARCHAR(191) NOT NULL,
    `star_wars_character_id` INTEGER NOT NULL,
    `star_wars_character_name` VARCHAR(191) NOT NULL,
    `star_wars_character_height` INTEGER NULL,
    `star_wars_character_mass` INTEGER NULL,
    `star_wars_homeworld_name` VARCHAR(191) NOT NULL,
    `star_wars_homeworld_climate` VARCHAR(191) NULL,
    `rnm_location_name` VARCHAR(191) NOT NULL,
    `rnm_location_type` VARCHAR(191) NULL,
    `rnm_location_dimension` VARCHAR(191) NULL,
    `fusion_description` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
