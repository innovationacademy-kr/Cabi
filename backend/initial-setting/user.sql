CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL,
  `intra_id` varchar(30) NOT NULL,
  `auth` tinyint(4) NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `phone` varchar(128) DEFAULT NULL,
  `firstLogin` datetime DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
