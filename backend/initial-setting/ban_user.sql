CREATE TABLE IF NOT EXISTS `ban_user` (  
  `ban_id` INT NOT NULL AUTO_INCREMENT,  
  `user_id` INT NOT NULL,  
  `intra_id` VARCHAR(30) NOT NULL,  
  `cabinet_id` INT,
  `bannedDate` DATETIME NOT NULL,
  `unBannedDate` DATETIME,
  PRIMARY KEY ( ban_id )
);
