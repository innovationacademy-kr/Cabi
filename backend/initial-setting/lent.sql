CREATE TABLE IF NOT EXISTS `lent` (
  `lent_id` int(11) NOT NULL AUTO_INCREMENT,
  `lent_cabinet_id` int(11) NOT NULL,
  `lent_user_id` int(11) NOT NULL,
  `lent_time` datetime NOT NULL,
  `expire_time` date NOT NULL,
  `extension` tinyint(4) NOT NULL,
  PRIMARY KEY (`lent_id`),
  UNIQUE KEY `lent_user_id_UNIQUE` (`lent_user_id`),
  UNIQUE KEY `lent_cabinet_id_UNIQUE` (`lent_cabinet_id`),
  KEY `user_id_idx` (`lent_user_id`),
  KEY `cabinet_id_idx` (`lent_cabinet_id`),
  CONSTRAINT `lent_cabinet_id` FOREIGN KEY (`lent_cabinet_id`) REFERENCES `cabinet` (`cabinet_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `lent_user_id` FOREIGN KEY (`lent_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3156 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
