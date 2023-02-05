-- MySQL dump 10.13  Distrib 8.0.31, for macos12.6 (arm64)
--
-- Host: 127.0.0.1    Database: test_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.10.2-MariaDB-1:10.10.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_user` (
  `email` varchar(128) NOT NULL COMMENT '구글 이메일',
  `role` tinyint(4) NOT NULL DEFAULT 0 COMMENT '관리자 권한',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='관리자 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` VALUES ('test@example.com',1);
/*!40000 ALTER TABLE `admin_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ban_log`
--

DROP TABLE IF EXISTS `ban_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ban_log` (
  `ban_log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '차단ID',
  `ban_user_id` int(11) NOT NULL COMMENT '유저ID',
  `ban_cabinet_id` int(11) NOT NULL COMMENT '사물함ID',
  `banned_date` datetime NOT NULL COMMENT '차단된 날짜',
  `unbanned_date` datetime NOT NULL COMMENT '차단해제된 시간',
  `is_penalty` tinyint(1) NOT NULL DEFAULT 0 COMMENT '반납 패널티로 인한 ban',
  PRIMARY KEY (`ban_log_id`),
  UNIQUE KEY `ban_id` (`ban_log_id`),
  KEY `ban_user_id` (`ban_user_id`),
  KEY `ban_cabinet_id` (`ban_cabinet_id`),
  CONSTRAINT `ban_user_id` FOREIGN KEY (`ban_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='차단 로그';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ban_log`
--

LOCK TABLES `ban_log` WRITE;
/*!40000 ALTER TABLE `ban_log` DISABLE KEYS */;
INSERT INTO `ban_log` VALUES (2,1,11,'2023-01-14 17:32:13','2023-01-15 17:32:13',0),(3,3,11,'2023-01-14 17:32:45','2023-01-17 17:32:45',1);
/*!40000 ALTER TABLE `ban_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabinet`
--

DROP TABLE IF EXISTS `cabinet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabinet` (
  `cabinet_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '사물함ID',
  `cabinet_num` int(11) NOT NULL COMMENT '사물함 번호',
  `location` varchar(32) NOT NULL COMMENT '건물 위치',
  `floor` int(11) NOT NULL COMMENT '층',
  `section` varchar(32) NOT NULL COMMENT '구역',
  `cabinet_status` varchar(32) NOT NULL DEFAULT 'AVAILABLE' COMMENT '사물함 상태',
  `lent_type` varchar(16) NOT NULL DEFAULT 'PRIVATE' COMMENT '사물함 타입',
  `max_user` tinyint(4) NOT NULL DEFAULT 3 COMMENT '최대 사용자 수',
  `min_user` tinyint(4) NOT NULL DEFAULT 0 COMMENT '최소 사용자 수',
  `memo` varchar(64) DEFAULT NULL COMMENT '비밀번호 메모',
  `title` varchar(64) DEFAULT NULL COMMENT '사물함 제목',
  `status_note` varchar(64) DEFAULT NULL COMMENT '사물함 상태 메모',
  PRIMARY KEY (`cabinet_id`),
  UNIQUE KEY `cabinet_id` (`cabinet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='사물함 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet`
--

LOCK TABLES `cabinet` WRITE;
/*!40000 ALTER TABLE `cabinet` DISABLE KEYS */;
INSERT INTO `cabinet` VALUES (1,1,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',3,0,NULL,NULL,NULL),(2,2,'새롬관',2,'End of Cluster 2','BROKEN','PRIVATE',3,0,NULL,NULL,NULL),(3,3,'새롬관',4,'Oasis','BANNED','PRIVATE',3,0,NULL,NULL,NULL),(4,4,'새롬관',4,'End of Cluster 4','SET_EXPIRE_FULL','PRIVATE',3,0,NULL,NULL,NULL),(5,5,'새롬관',2,'Cluster 1 - OA','AVAILABLE','SHARE',3,0,NULL,NULL,NULL),(6,6,'새롬관',2,'End of Cluster 1','BROKEN','SHARE',3,0,NULL,NULL,NULL),(7,7,'새롬관',4,'Cluster 3 - OA','BANNED','SHARE',3,0,NULL,NULL,NULL),(8,8,'새롬관',4,'End of Cluster 3','SET_EXPIRE_FULL','SHARE',3,0,NULL,NULL,NULL),(9,9,'새롬관',5,'Oasis','SET_EXPIRE_AVAILABLE','SHARE',3,0,NULL,NULL,NULL),(10,10,'새롬관',2,'Cluster 1 - OA','AVAILABLE','SHARE',3,0,NULL,NULL,NULL),(11,11,'새롬관',5,'Cluster 5 - OA','SET_EXPIRE_AVAILABLE','SHARE',3,0,NULL,NULL,NULL),(12,12,'새롬관',2,'Cluster 1 - OA','SET_EXPIRE_FULL','CLUB',3,0,NULL,'CABI',NULL),(13,13,'새롬관',5,'End of Cluster 5','EXPIRED','PRIVATE',3,0,NULL,NULL,NULL),(14,14,'새롬관',4,'Cluster 3 - OA','EXPIRED','SHARE',3,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cabinet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lent`
--

DROP TABLE IF EXISTS `lent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='현재 대여 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent`
--

LOCK TABLES `lent` WRITE;
/*!40000 ALTER TABLE `lent` DISABLE KEYS */;
INSERT INTO `lent` VALUES (1,4,5,'2023-01-22 23:59:59','2023-01-01 23:55:59'),(2,13,6,'2023-01-13 23:59:59','2022-12-24 18:59:59'),(3,10,9,NULL,'2023-01-03 22:59:05'),(4,10,10,NULL,'2023-01-03 21:59:59'),(5,11,11,'2023-02-13 23:59:59','2023-01-03 23:47:59'),(6,11,12,'2023-02-13 23:59:59','2023-01-03 23:57:59'),(7,8,13,'2023-01-25 23:59:59','2022-12-15 08:59:59'),(8,8,14,'2023-01-25 23:59:59','2022-12-15 12:59:59'),(9,8,15,'2023-01-25 23:59:59','2022-12-15 04:59:59'),(10,14,16,'2023-01-11 23:59:59','2022-12-01 15:07:59'),(11,9,17,'2023-02-13 23:59:59','2023-01-03 23:47:59');
/*!40000 ALTER TABLE `lent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lent_log`
--

DROP TABLE IF EXISTS `lent_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lent_log` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '로그ID',
  `log_user_id` int(11) NOT NULL COMMENT '유저ID',
  `log_intra_id` varchar(32) NOT NULL COMMENT '유저의 intra_id',
  `log_cabinet_id` int(11) NOT NULL COMMENT '사물함ID',
  `lent_time` datetime DEFAULT NULL COMMENT '대여일',
  `return_time` datetime DEFAULT NULL COMMENT '반납일',
  PRIMARY KEY (`log_id`),
  UNIQUE KEY `log_id` (`log_id`),
  KEY `log_cabinet_id` (`log_cabinet_id`),
  KEY `log_user_id` (`log_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='과거 대여 이력';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent_log`
--

LOCK TABLES `lent_log` WRITE;
/*!40000 ALTER TABLE `lent_log` DISABLE KEYS */;
INSERT INTO `lent_log` VALUES (1,1,'banuser1',11,'2022-12-24 23:59:59','2023-01-14 17:32:13'),(2,3,'penalty1',11,'2023-01-14 17:32:00','2023-01-14 17:32:45'),(3,5,'lentuser1',3,'2022-01-20 19:25:20','2022-02-20 19:25:28'),(4,5,'lentuser1',4,'2022-07-03 19:25:45','2023-08-20 19:25:55'),(5,5,'lentuser1',5,'2022-08-23 19:26:19','2022-08-24 19:26:19'),(6,5,'lentuser1',5,'2022-08-24 19:26:20','2022-08-25 19:26:19'),(7,5,'lentuser1',5,'2022-08-25 19:26:20','2022-08-26 19:26:19'),(8,5,'lentuser1',3,'2022-09-20 19:25:20','2022-09-21 19:25:28'),(9,5,'lentuser1',4,'2022-09-22 19:25:45','2023-09-23 19:25:55'),(10,5,'lentuser1',5,'2022-09-24 19:26:19','2022-09-25 19:26:19'),(11,5,'lentuser1',5,'2022-09-26 19:26:20','2022-09-27 19:26:19'),(12,5,'lentuser1',5,'2022-09-28 19:26:20','2022-09-29 19:26:19'),(13,5,'lentuser1',5,'2022-09-29 20:26:20','2022-09-30 19:26:19');
/*!40000 ALTER TABLE `lent_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL COMMENT '유저ID',
  `intra_id` varchar(32) NOT NULL COMMENT '인트라ID',
  `email` varchar(128) DEFAULT NULL COMMENT '이메일',
  `first_login` datetime DEFAULT NULL COMMENT '첫 로그인 시간',
  `last_login` datetime DEFAULT NULL COMMENT '마지막 로그인 시간',
  `blackhole_date` datetime DEFAULT NULL COMMENT '블랙홀 빠지는 날짜',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `intra_id` (`intra_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='유저 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'banuser1','banuser1@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:06:44','2024-12-31 00:00:00'),(2,'banuser2','banuser2@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:06:46','2024-12-31 00:00:00'),(3,'penaltyuser1','penaltyuser1@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:07:49','2024-12-31 00:00:00'),(4,'penaltyuser2','penaltyuser2@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:08:18','2024-12-31 00:00:00'),(5,'lentuser1','lentuser1@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:09:12','2024-12-31 00:00:00'),(6,'lentuser2','lentuser2@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:09:30','2024-12-31 00:00:00'),(7,'koreauser','koreauser@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:10:06','2024-12-31 00:00:00'),(8,'foreignuser','foreignuser@student.42.fr','2023-01-01 17:06:42','2023-01-20 17:11:06','2024-12-31 00:00:00'),(9,'user1','user1@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:11:41','2024-12-31 00:00:00'),(10,'user2','user2@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:12:04','2024-12-31 00:00:00'),(11,'user3','user3@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:12:04','2024-12-31 00:00:00'),(12,'user4','user4@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:12:04','2024-12-31 00:00:00'),(13,'user5','user5@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:15:19','2024-12-31 00:00:00'),(14,'user6','user6@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:15:36','2024-12-31 00:00:00'),(15,'user7','user7@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:15:36','2024-12-31 00:00:00'),(16,'user8','user8@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:15:36','2024-12-31 00:00:00'),(17,'user9','user9@student.42seoul.kr','2023-01-01 17:06:42','2023-01-20 17:15:36','2024-12-31 00:00:00');
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

-- Dump completed on 2023-02-05 18:44:14
