-- this is not okay because `roles` and `permissions` tables are not created before the permission_role table
CREATE TABLE `permission_role` (
 `permission_id` int(10) unsigned NOT NULL,
 `role_id` int(10) unsigned NOT NULL,
 PRIMARY KEY (`permission_id`,`role_id`),
 KEY `permission_role_role_id_foreign` (`role_id`),
 CONSTRAINT `permission_role_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
 CONSTRAINT `permission_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- this is not okay because `users` table is not created yet
CREATE TABLE `roles` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 PRIMARY KEY (`id`),
 KEY `roles_user_id_foreign` (`user_id`),
 CONSTRAINT `roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 PRIMARY KEY (`id`),
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- this is okay because the users table is created before the reservations table
CREATE TABLE `reservations` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 PRIMARY KEY (`id`),
 KEY `reservations_user_id_foreign` (`user_id`),
 CONSTRAINT `reservations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


