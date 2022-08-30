CREATE TABLE IF NOT EXISTS `cabinet` (
  `cabinet_id` int(11) NOT NULL AUTO_INCREMENT,
  `cabinet_num` int(11) NOT NULL,
  `location` varchar(30) COLLATE utf8_bin NOT NULL,
  `floor` int(11) NOT NULL,
  `section` varchar(30) NOT NULL,
  `activation` tinyint(4) NOT NULL,
  PRIMARY KEY (`cabinet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=latin1;



