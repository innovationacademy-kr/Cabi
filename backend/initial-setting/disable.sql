CREATE TABLE IF NOT EXISTS `disable`  (
	`disable_id` INT AUTO_INCREMENT PRIMARY KEY,
	`disable_cabinet_id` INT NOT NULL,
    `disable_time` TIMESTAMP DEFAULT current_timestamp,
    `fix_time` TIMESTAMP,
	`status` TINYINT DEFAULT 1,
    `note` TEXT
) ENGINE=innoDB DEFAULT CHARSET=utf8mb4;
