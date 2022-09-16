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
  KEY `ban_user_id` (`ban_user_id`),
  CONSTRAINT `ban_cabinet_id` FOREIGN KEY (`ban_cabinet_id`) REFERENCES `cabinet` (`cabinet_id`) ON UPDATE CASCADE,
  CONSTRAINT `ban_user_id` FOREIGN KEY (`ban_user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
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
  `floor` int(11) NOT NULL COMMENT '층',
  `location` varchar(32) NOT NULL COMMENT '건물 위치',
  `section` varchar(32) NOT NULL COMMENT '구역',
  `activation` tinyint(4) NOT NULL DEFAULT 1 COMMENT '사용가능 여부',
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
  `expire_time` datetime NOT NULL COMMENT '만료일',
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
  UNIQUE KEY `log_id_2` (`log_id`),
  KEY `log_cabinet_id` (`log_cabinet_id`),
  KEY `log_user_id` (`log_user_id`),
  CONSTRAINT `log_cabinet_id` FOREIGN KEY (`log_cabinet_id`) REFERENCES `cabinet` (`cabinet_id`) ON UPDATE CASCADE,
  CONSTRAINT `log_user_id` FOREIGN KEY (`log_user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
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
  `phone` varchar(128) DEFAULT NULL COMMENT '휴대폰 번호',
  `first_login` datetime DEFAULT NULL COMMENT '첫 로그인 시간',
  `last_login` datetime DEFAULT NULL COMMENT '마지막 로그인 시간',
  `is_lent` tinyint(1) NOT NULL COMMENT '대여 여부',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `intra_id` (`intra_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
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
