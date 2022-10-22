-- MySQL dump 10.19  Distrib 10.3.36-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: 42cabi_v3_test
-- ------------------------------------------------------
-- Server version	10.3.36-MariaDB-0+deb10u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ban_log` (
  `ban_log_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '차단ID',
  `ban_user_id` int(11) NOT NULL COMMENT '유저ID',
  `ban_cabinet_id` int(11) NOT NULL COMMENT '사물함ID',
  `banned_date` datetime NOT NULL COMMENT '차단된 날짜',
  `unbanned_date` datetime NOT NULL COMMENT '차단해제된 시간',
  `is_penalty` tinyint(1) NOT NULL DEFAULT 0 COMMENT '반납 패널티로 인한 ban',
  PRIMARY KEY (`ban_log_id`),
  UNIQUE KEY `ban_id` (`ban_log_id`),
  KEY `ban_cabinet_id` (`ban_cabinet_id`),
  KEY `ban_user_id` (`ban_user_id`),
  CONSTRAINT `ban_user_id` FOREIGN KEY (`ban_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
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
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`cabinet_id`),
  UNIQUE KEY `cabinet_id` (`cabinet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=utf8 COMMENT='사물함 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet`
--

LOCK TABLES `cabinet` WRITE;
/*!40000 ALTER TABLE `cabinet` DISABLE KEYS */;
INSERT INTO `cabinet` VALUES (1,89,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(2,90,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(3,91,'새롬관',2,'Oasis','BROKEN','SHARE',3,0,NULL,NULL),(4,92,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(5,93,'새롬관',2,'Oasis','BANNED','SHARE',3,0,NULL,NULL),(6,94,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(7,95,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(8,96,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(9,97,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(10,98,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(11,99,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(12,100,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(13,101,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(14,102,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(15,103,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(16,104,'새롬관',2,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(17,105,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(18,106,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(19,107,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(20,108,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(21,109,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(22,110,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(23,111,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(24,112,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(25,113,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(26,114,'새롬관',2,'Oasis','BROKEN','PRIVATE',1,0,NULL,NULL),(27,115,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(28,116,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(29,117,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(30,118,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(31,119,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(32,120,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(33,121,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(34,122,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(35,123,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(36,124,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(37,125,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(38,126,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(39,127,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(40,128,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(41,129,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(42,130,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(43,131,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(44,132,'새롬관',2,'Oasis','BROKEN','PRIVATE',1,0,NULL,NULL),(45,133,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(46,134,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(47,135,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(48,136,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(49,137,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(50,138,'새롬관',2,'Oasis','BANNED','PRIVATE',1,0,NULL,NULL),(51,139,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(52,140,'새롬관',2,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(53,141,'새롬관',2,'End of Cluster 2','AVAILABLE','SHARE',3,0,NULL,NULL),(54,142,'새롬관',2,'End of Cluster 2','AVAILABLE','SHARE',3,0,NULL,NULL),(55,143,'새롬관',2,'End of Cluster 2','AVAILABLE','SHARE',3,0,NULL,NULL),(56,144,'새롬관',2,'End of Cluster 2','AVAILABLE','PRIVATE',1,0,NULL,NULL),(57,145,'새롬관',2,'End of Cluster 2','AVAILABLE','PRIVATE',1,0,NULL,NULL),(58,146,'새롬관',2,'End of Cluster 2','AVAILABLE','PRIVATE',1,0,NULL,NULL),(59,147,'새롬관',2,'End of Cluster 2','AVAILABLE','PRIVATE',1,0,NULL,NULL),(60,148,'새롬관',2,'End of Cluster 2','AVAILABLE','PRIVATE',1,0,NULL,NULL),(61,17,'새롬관',2,'Cluster 1 - OA','BROKEN','CIRCLE',1,0,NULL,NULL),(62,18,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(63,19,'새롬관',2,'Cluster 1 - OA','BANNED','CIRCLE',1,0,NULL,NULL),(64,20,'새롬관',2,'Cluster 1 - OA','SET_EXPIRE_FULL','CIRCLE',1,0,NULL,'42CABI'),(65,21,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(66,22,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(67,23,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(68,24,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(69,25,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(70,26,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(71,27,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(72,28,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(73,29,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(74,30,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(75,31,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(76,32,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(77,33,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(78,34,'새롬관',2,'Cluster 1 - OA','BROKEN','CIRCLE',1,0,NULL,NULL),(79,35,'새롬관',2,'Cluster 1 - OA','AVAILABLE','CIRCLE',1,0,NULL,NULL),(80,36,'새롬관',2,'Cluster 1 - OA','BANNED','CIRCLE',1,0,NULL,NULL),(81,1,'새롬관',2,'End of Cluster 1','AVAILABLE','SHARE',3,0,NULL,NULL),(82,2,'새롬관',2,'End of Cluster 1','AVAILABLE','SHARE',3,0,NULL,NULL),(83,3,'새롬관',2,'End of Cluster 1','AVAILABLE','SHARE',3,0,NULL,NULL),(84,4,'새롬관',2,'End of Cluster 1','AVAILABLE','SHARE',3,0,NULL,NULL),(85,5,'새롬관',2,'End of Cluster 1','AVAILABLE','SHARE',3,0,NULL,NULL),(86,6,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(87,7,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(88,8,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(89,9,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(90,10,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(91,11,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(92,12,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(93,13,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(94,14,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(95,15,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(96,16,'새롬관',2,'End of Cluster 1','AVAILABLE','PRIVATE',1,0,NULL,NULL),(97,37,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(98,38,'새롬관',2,'Cluster 1 - Terrace','BANNED','SHARE',3,0,NULL,NULL),(99,39,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(100,40,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(101,41,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(102,42,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(103,43,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(104,44,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(105,45,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(106,46,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(107,47,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(108,48,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(109,49,'새롬관',2,'Cluster 1 - Terrace','BANNED','SHARE',3,0,NULL,NULL),(110,50,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(111,51,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(112,52,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','SHARE',3,0,NULL,NULL),(113,53,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(114,54,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(115,55,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(116,56,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(117,57,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(118,58,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(119,59,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(120,60,'새롬관',2,'Cluster 1 - Terrace','BANNED','PRIVATE',1,0,NULL,NULL),(121,61,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(122,62,'새롬관',2,'Cluster 1 - Terrace','BANNED','PRIVATE',1,0,NULL,NULL),(123,63,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(124,64,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(125,65,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(126,66,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(127,67,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(128,68,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(129,69,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(130,70,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(131,71,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(132,72,'새롬관',2,'Cluster 1 - Terrace','BROKEN','PRIVATE',1,0,NULL,NULL),(133,73,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(134,74,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(135,75,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(136,76,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(137,77,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(138,78,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(139,79,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(140,80,'새롬관',2,'Cluster 1 - Terrace','BANNED','PRIVATE',1,0,NULL,NULL),(141,81,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(142,82,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(143,83,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(144,84,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(145,85,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(146,86,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(147,87,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(148,88,'새롬관',2,'Cluster 1 - Terrace','AVAILABLE','PRIVATE',1,0,NULL,NULL),(149,37,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(150,38,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(151,39,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(152,40,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(153,41,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(154,42,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(155,43,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(156,44,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(157,45,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(158,46,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(159,47,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(160,48,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(161,49,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(162,50,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(163,51,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(164,52,'새롬관',4,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(165,53,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(166,54,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(167,55,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(168,56,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(169,57,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(170,58,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(171,59,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(172,60,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(173,61,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(174,62,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(175,63,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(176,64,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(177,65,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(178,66,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(179,67,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(180,68,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(181,69,'새롬관',4,'Oasis','BANNED','PRIVATE',1,0,NULL,NULL),(182,70,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(183,71,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(184,72,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(185,73,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(186,74,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(187,75,'새롬관',4,'Oasis','BROKEN','PRIVATE',1,0,NULL,NULL),(188,76,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(189,77,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(190,78,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(191,79,'새롬관',4,'Oasis','BROKEN','PRIVATE',1,0,NULL,NULL),(192,80,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(193,81,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(194,82,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(195,83,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(196,84,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(197,85,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(198,86,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(199,87,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(200,88,'새롬관',4,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(201,89,'새롬관',4,'End of Cluster 4','AVAILABLE','SHARE',3,0,NULL,NULL),(202,90,'새롬관',4,'End of Cluster 4','AVAILABLE','SHARE',3,0,NULL,NULL),(203,91,'새롬관',4,'End of Cluster 4','AVAILABLE','SHARE',3,0,NULL,NULL),(204,92,'새롬관',4,'End of Cluster 4','AVAILABLE','SHARE',3,0,NULL,NULL),(205,93,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(206,94,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(207,95,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(208,96,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(209,97,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(210,98,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(211,99,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(212,100,'새롬관',4,'End of Cluster 4','AVAILABLE','PRIVATE',1,0,NULL,NULL),(213,17,'새롬관',4,'Cluster 3 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(214,18,'새롬관',4,'Cluster 3 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(215,19,'새롬관',4,'Cluster 3 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(216,20,'새롬관',4,'Cluster 3 - OA','BROKEN','SHARE',3,0,NULL,NULL),(217,21,'새롬관',4,'Cluster 3 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(218,22,'새롬관',4,'Cluster 3 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(219,23,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(220,24,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(221,25,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(222,26,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(223,27,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(224,28,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(225,29,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(226,30,'새롬관',4,'Cluster 3 - OA','BROKEN','PRIVATE',1,0,NULL,NULL),(227,31,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(228,32,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(229,33,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(230,34,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(231,35,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(232,36,'새롬관',4,'Cluster 3 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(233,1,'새롬관',4,'End of Cluster 3','AVAILABLE','SHARE',3,0,NULL,NULL),(234,2,'새롬관',4,'End of Cluster 3','AVAILABLE','SHARE',3,0,NULL,NULL),(235,3,'새롬관',4,'End of Cluster 3','AVAILABLE','SHARE',3,0,NULL,NULL),(236,4,'새롬관',4,'End of Cluster 3','BROKEN','SHARE',3,0,NULL,NULL),(237,5,'새롬관',4,'End of Cluster 3','AVAILABLE','SHARE',3,0,NULL,NULL),(238,6,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(239,7,'새롬관',4,'End of Cluster 3','BROKEN','PRIVATE',1,0,NULL,NULL),(240,8,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(241,9,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(242,10,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(243,11,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(244,12,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(245,13,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(246,14,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(247,15,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(248,16,'새롬관',4,'End of Cluster 3','AVAILABLE','PRIVATE',1,0,NULL,NULL),(249,37,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(250,38,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(251,39,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(252,40,'새롬관',5,'Oasis','BROKEN','SHARE',3,0,NULL,NULL),(253,41,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(254,42,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(255,43,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(256,44,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(257,45,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(258,46,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(259,47,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(260,48,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(261,49,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(262,50,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(263,51,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(264,52,'새롬관',5,'Oasis','AVAILABLE','SHARE',3,0,NULL,NULL),(265,53,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(266,54,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(267,55,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(268,56,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(269,57,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(270,58,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(271,59,'새롬관',5,'Oasis','BROKEN','PRIVATE',1,0,NULL,NULL),(272,60,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(273,61,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(274,62,'새롬관',5,'Oasis','BANNED','PRIVATE',1,0,NULL,NULL),(275,63,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(276,64,'새롬관',5,'Oasis','BROKEN','PRIVATE',1,0,NULL,NULL),(277,65,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(278,66,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(279,67,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(280,68,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(281,69,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(282,70,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(283,71,'새롬관',5,'Oasis','BROKEN','PRIVATE',1,0,NULL,NULL),(284,72,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(285,73,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(286,74,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(287,75,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(288,76,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(289,77,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(290,78,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(291,79,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(292,80,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(293,81,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(294,82,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(295,83,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(296,84,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(297,85,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(298,86,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(299,87,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(300,88,'새롬관',5,'Oasis','AVAILABLE','PRIVATE',1,0,NULL,NULL),(301,17,'새롬관',5,'Cluster 5 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(302,18,'새롬관',5,'Cluster 5 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(303,19,'새롬관',5,'Cluster 5 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(304,20,'새롬관',5,'Cluster 5 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(305,21,'새롬관',5,'Cluster 5 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(306,22,'새롬관',5,'Cluster 5 - OA','AVAILABLE','SHARE',3,0,NULL,NULL),(307,23,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(308,24,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(309,25,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(310,26,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(311,27,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(312,28,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(313,29,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(314,30,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(315,31,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(316,32,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(317,33,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(318,34,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(319,35,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(320,36,'새롬관',5,'Cluster 5 - OA','AVAILABLE','PRIVATE',1,0,NULL,NULL),(321,1,'새롬관',5,'End of Cluster 5','AVAILABLE','SHARE',3,0,NULL,NULL),(322,2,'새롬관',5,'End of Cluster 5','AVAILABLE','SHARE',3,0,NULL,NULL),(323,3,'새롬관',5,'End of Cluster 5','AVAILABLE','SHARE',3,0,NULL,NULL),(324,4,'새롬관',5,'End of Cluster 5','AVAILABLE','SHARE',3,0,NULL,NULL),(325,5,'새롬관',5,'End of Cluster 5','AVAILABLE','SHARE',3,0,NULL,NULL),(326,6,'새롬관',5,'End of Cluster 5','BROKEN','PRIVATE',1,0,NULL,NULL),(327,7,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(328,8,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(329,9,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(330,10,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(331,11,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(332,12,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(333,13,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(334,14,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(335,15,'새롬관',5,'End of Cluster 5','AVAILABLE','PRIVATE',1,0,NULL,NULL),(336,16,'새롬관',5,'End of Cluster 5','BROKEN','PRIVATE',1,0,NULL,NULL),(337,89,'새롬관',5,'End of Cluster 6','AVAILABLE','SHARE',3,0,NULL,NULL),(338,90,'새롬관',5,'End of Cluster 6','AVAILABLE','SHARE',3,0,NULL,NULL),(339,91,'새롬관',5,'End of Cluster 6','AVAILABLE','SHARE',3,0,NULL,NULL),(340,92,'새롬관',5,'End of Cluster 6','AVAILABLE','PRIVATE',1,0,NULL,NULL),(341,93,'새롬관',5,'End of Cluster 6','BROKEN','PRIVATE',1,0,NULL,NULL),(342,94,'새롬관',5,'End of Cluster 6','AVAILABLE','PRIVATE',1,0,NULL,NULL),(343,95,'새롬관',5,'End of Cluster 6','AVAILABLE','PRIVATE',1,0,NULL,NULL),(344,96,'새롬관',5,'End of Cluster 6','BROKEN','PRIVATE',1,0,NULL,NULL);
/*!40000 ALTER TABLE `cabinet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lent`
--

DROP TABLE IF EXISTS `lent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL COMMENT '유저ID',
  `intra_id` varchar(32) NOT NULL COMMENT '인트라ID',
  `state` varchar(16) NOT NULL DEFAULT 'NORMAL' COMMENT '유저의 상태',
  `email` varchar(128) DEFAULT NULL COMMENT '이메일',
  `first_login` datetime DEFAULT NULL COMMENT '첫 로그인 시간',
  `last_login` datetime DEFAULT NULL COMMENT '마지막 로그인 시간',
  `blackhole_date` datetime DEFAULT NULL COMMENT '블랙홀 빠지는 날짜',
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

-- Dump completed on 2022-10-22 13:35:47
