CREATE TABLE `event` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `intra_id` varchar(40) COLLATE utf8_bin DEFAULT NULL,
  `isEvent` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
