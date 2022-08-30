CREATE TABLE IF NOT EXISTS `lent_log` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `log_user_id` int(11) NOT NULL,
  `log_cabinet_id` int(11) NOT NULL,
  `lent_time` datetime NOT NULL,
  `return_time` datetime NOT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2381 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
