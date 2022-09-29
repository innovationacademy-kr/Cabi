-- MySQL dump 10.13  Distrib 8.0.30, for macos12.4 (arm64)
--
-- Host: 127.0.0.1    Database: 42cabi_v3_test
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.34-MariaDB-0+deb10u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ban_log`
--

DROP TABLE IF EXISTS `ban_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `ban_log` (
  `ban_log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '차단ID',
  `ban_user_id` int(11) NOT NULL COMMENT '유저ID',
  `ban_cabinet_id` int(11) NOT NULL COMMENT '사물함ID',
  `banned_date` datetime NOT NULL COMMENT '차단된 날짜',
  `unbanned_date` datetime NOT NULL COMMENT '차단해제된 시간',
  PRIMARY KEY (`ban_log_id`),
  UNIQUE KEY `ban_id` (`ban_log_id`),
  KEY `ban_cabinet_id` (`ban_cabinet_id`),
  KEY `ban_user_id` (`ban_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='차단 로그';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ban_log`
--

LOCK TABLES `ban_log` WRITE;
/*!40000 ALTER TABLE `ban_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `ban_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabinet`
--

DROP TABLE IF EXISTS `cabinet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `cabinet` (
  `cabinet_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '사물함ID',
  `cabinet_num` int(11) NOT NULL COMMENT '사물함 번호',
  `location` varchar(32) NOT NULL COMMENT '건물 위치',
  `floor` int(11) NOT NULL COMMENT '층',
  `section` varchar(32) NOT NULL COMMENT '구역',
  `cabinet_status` varchar(16) NOT NULL DEFAULT 'AVAILABLE' COMMENT '사물함 상태',
  `lent_type` varchar(16) NOT NULL DEFAULT 'PRIVATE' COMMENT '사물함 타입',
  `max_user` tinyint(4) NOT NULL DEFAULT 3 COMMENT '최대 사용자 수',
  `min_user` tinyint(4) NOT NULL DEFAULT 0 COMMENT '최소 사용자 수',
  `memo` varchar(64) DEFAULT NULL COMMENT '비밀번호 메모',
  `title` varchar(64) DEFAULT NULL COMMENT '사물함 제목',
  PRIMARY KEY (`cabinet_id`),
  UNIQUE KEY `cabinet_id` (`cabinet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='사물함 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet`
--

LOCK TABLES `cabinet` WRITE;
/*!40000 ALTER TABLE `cabinet` DISABLE KEYS */;
/*!40000 ALTER TABLE `cabinet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lent`
--

DROP TABLE IF EXISTS `lent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `lent` (
  `lent_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '렌트ID',
  `lent_cabinet_id` int(11) NOT NULL COMMENT '사물함ID',
  `lent_user_id` int(11) NOT NULL COMMENT '유저ID',
  `expire_time` datetime DEFAULT NULL COMMENT '만료일',
  `lent_time` datetime NOT NULL COMMENT '대여시간',
  PRIMARY KEY (`lent_id`),
  UNIQUE KEY `lent_id` (`lent_id`),
  UNIQUE KEY `lent_user_id` (`lent_user_id`),
  KEY `lent_cabinet_id` (`lent_cabinet_id`),
  CONSTRAINT `lent_cabinet_id` FOREIGN KEY (`lent_cabinet_id`) REFERENCES `cabinet` (`cabinet_id`) ON UPDATE CASCADE,
  CONSTRAINT `lent_user_id` FOREIGN KEY (`lent_user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='현재 대여 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent`
--

LOCK TABLES `lent` WRITE;
/*!40000 ALTER TABLE `lent` DISABLE KEYS */;
/*!40000 ALTER TABLE `lent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lent_log`
--

DROP TABLE IF EXISTS `lent_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `lent_log` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '로그ID',
  `log_user_id` int(11) NOT NULL COMMENT '유저ID',
  `log_cabinet_id` int(11) NOT NULL COMMENT '사물함ID',
  `lent_time` datetime NOT NULL COMMENT '대여일',
  `return_time` datetime NOT NULL COMMENT '반납일',
  PRIMARY KEY (`log_id`),
  UNIQUE KEY `log_id` (`log_id`),
  KEY `log_cabinet_id` (`log_cabinet_id`),
  KEY `log_user_id` (`log_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='과거 대여 이력';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent_log`
--

LOCK TABLES `lent_log` WRITE;
/*!40000 ALTER TABLE `lent_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `lent_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL COMMENT '유저ID',
  `intra_id` varchar(32) NOT NULL COMMENT '인트라ID',
  `state` tinyint(4) NOT NULL DEFAULT 0 COMMENT '유저의 상태',
  `email` varchar(128) DEFAULT NULL COMMENT '이메일',
  `first_login` datetime DEFAULT NULL COMMENT '첫 로그인 시간',
  `last_login` datetime DEFAULT NULL COMMENT '마지막 로그인 시간',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `intra_id` (`intra_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='유저 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-16 17:22:43


-- Insert Sample Data
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (89, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (90, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (91, '새롬관', 2, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (92, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (93, '새롬관', 2, 'Oasis', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (94, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (95, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (96, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (97, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (98, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (99, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (100, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (101, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (102, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (103, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (104, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (105, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (106, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (107, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (108, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (109, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (110, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (111, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (112, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (113, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (114, '새롬관', 2, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (115, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (116, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (117, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (118, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (119, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (120, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (121, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (122, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (123, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (124, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (125, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (126, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (127, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (128, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (129, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (130, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (131, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (132, '새롬관', 2, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (133, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (134, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (135, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (136, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (137, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (138, '새롬관', 2, 'Oasis', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (139, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (140, '새롬관', 2, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (141, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (142, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (143, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (144, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (145, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (146, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (147, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (148, '새롬관', 2, 'End of Cluster 2', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (17, '새롬관', 2, 'Cluster 1 - OA', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (18, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (19, '새롬관', 2, 'Cluster 1 - OA', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (20, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (21, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (22, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (23, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (24, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (25, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (26, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (27, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (28, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (29, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (30, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (31, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (32, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (33, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (34, '새롬관', 2, 'Cluster 1 - OA', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (35, '새롬관', 2, 'Cluster 1 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (36, '새롬관', 2, 'Cluster 1 - OA', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (1, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (2, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (3, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (4, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (5, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (6, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (7, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (8, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (9, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (10, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (11, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (12, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (13, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (14, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (15, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (16, '새롬관', 2, 'End of Cluster 1', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (37, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (38, '새롬관', 2, 'Cluster 1 - Terrace', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (39, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (40, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (41, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (42, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (43, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (44, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (45, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (46, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (47, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (48, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (49, '새롬관', 2, 'Cluster 1 - Terrace', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (50, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (51, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (52, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (53, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (54, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (55, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (56, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (57, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (58, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (59, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (60, '새롬관', 2, 'Cluster 1 - Terrace', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (61, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (62, '새롬관', 2, 'Cluster 1 - Terrace', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (63, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (64, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (65, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (66, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (67, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (68, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (69, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (70, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (71, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (72, '새롬관', 2, 'Cluster 1 - Terrace', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (73, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (74, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (75, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (76, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (77, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (78, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (79, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (80, '새롬관', 2, 'Cluster 1 - Terrace', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (81, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (82, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (83, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (84, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (85, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (86, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (87, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (88, '새롬관', 2, 'Cluster 1 - Terrace', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (37, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (38, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (39, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (40, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (41, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (42, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (43, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (44, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (45, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (46, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (47, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (48, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (49, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (50, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (51, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (52, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (53, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (54, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (55, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (56, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (57, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (58, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (59, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (60, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (61, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (62, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (63, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (64, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (65, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (66, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (67, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (68, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (69, '새롬관', 4, 'Oasis', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (70, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (71, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (72, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (73, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (74, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (75, '새롬관', 4, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (76, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (77, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (78, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (79, '새롬관', 4, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (80, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (81, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (82, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (83, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (84, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (85, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (86, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (87, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (88, '새롬관', 4, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (89, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (90, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (91, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (92, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (93, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (94, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (95, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (96, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (97, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (98, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (99, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (100, '새롬관', 4, 'End of Cluster 4', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (17, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (18, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (19, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (20, '새롬관', 4, 'Cluster 3 - OA', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (21, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (22, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (23, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (24, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (25, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (26, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (27, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (28, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (29, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (30, '새롬관', 4, 'Cluster 3 - OA', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (31, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (32, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (33, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (34, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (35, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (36, '새롬관', 4, 'Cluster 3 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (1, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (2, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (3, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (4, '새롬관', 4, 'End of Cluster 3', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (5, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (6, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (7, '새롬관', 4, 'End of Cluster 3', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (8, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (9, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (10, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (11, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (12, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (13, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (14, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (15, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (16, '새롬관', 4, 'End of Cluster 3', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (37, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (38, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (39, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (40, '새롬관', 5, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (41, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (42, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (43, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (44, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (45, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (46, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (47, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (48, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (49, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (50, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (51, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (52, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (53, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (54, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (55, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (56, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (57, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (58, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (59, '새롬관', 5, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (60, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (61, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (62, '새롬관', 5, 'Oasis', 'BANNED');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (63, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (64, '새롬관', 5, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (65, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (66, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (67, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (68, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (69, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (70, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (71, '새롬관', 5, 'Oasis', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (72, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (73, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (74, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (75, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (76, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (77, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (78, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (79, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (80, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (81, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (82, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (83, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (84, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (85, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (86, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (87, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (88, '새롬관', 5, 'Oasis', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (17, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (18, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (19, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (20, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (21, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (22, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (23, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (24, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (25, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (26, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (27, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (28, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (29, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (30, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (31, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (32, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (33, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (34, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (35, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (36, '새롬관', 5, 'Cluster 5 - OA', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (1, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (2, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (3, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (4, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (5, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (6, '새롬관', 5, 'End of Cluster 5', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (7, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (8, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (9, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (10, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (11, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (12, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (13, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (14, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (15, '새롬관', 5, 'End of Cluster 5', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (16, '새롬관', 5, 'End of Cluster 5', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (89, '새롬관', 5, 'End of Cluster 6', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (90, '새롬관', 5, 'End of Cluster 6', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (91, '새롬관', 5, 'End of Cluster 6', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (92, '새롬관', 5, 'End of Cluster 6', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (93, '새롬관', 5, 'End of Cluster 6', 'BROKEN');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (94, '새롬관', 5, 'End of Cluster 6', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (95, '새롬관', 5, 'End of Cluster 6', 'AVAILABLE');
INSERT INTO cabinet (cabinet_num, location, floor, section, cabinet_status) VALUES (96, '새롬관', 5, 'End of Cluster 6', 'BROKEN');

UPDATE cabinet
SET
    lent_type = 'SHARE'
WHERE
    floor = 2;
