-- MySQL dump 10.13  Distrib 8.0.33, for macos13.3 (arm64)
--
-- Host: 127.0.0.1    Database: cabi_local
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.39-MariaDB-0+deb10u1

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
  `admin_user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `role` varchar(16) NOT NULL,
  PRIMARY KEY (`admin_user_id`),
  UNIQUE KEY `UK_6etwowal6qxvr7xuvqcqmnnk7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` VALUES (1,'admin0@gmail.com','NONE'),(2,'admin1@gmail.com','ADMIN'),(3,'admin2@gmail.com','MASTER'),(4,'innoaca@cabi.42seoul.io','MASTER');
/*!40000 ALTER TABLE `admin_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ban_history`
--

DROP TABLE IF EXISTS `ban_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ban_history` (
  `ban_history_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ban_type` varchar(32) NOT NULL,
  `banned_at` datetime(6) NOT NULL,
  `unbanned_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ban_history_id`),
  KEY `ban_history_user_id` (`user_id`),
  CONSTRAINT `ban_history_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ban_history`
--

LOCK TABLES `ban_history` WRITE;
/*!40000 ALTER TABLE `ban_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `ban_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabinet`
--

DROP TABLE IF EXISTS `cabinet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabinet` (
  `cabinet_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `col` int(11) DEFAULT NULL,
  `row` int(11) DEFAULT NULL,
  `lent_type` varchar(16) NOT NULL,
  `max_user` int(11) NOT NULL,
  `status` varchar(32) NOT NULL,
  `status_note` varchar(64) DEFAULT NULL,
  `visible_num` int(11) DEFAULT NULL,
  `cabinet_place_id` bigint(20) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `memo` varchar(64) DEFAULT NULL,
  `version` bigint(20) DEFAULT 1,
  PRIMARY KEY (`cabinet_id`),
  KEY `FKah76pjwfflx2q114ixtihoa3g` (`cabinet_place_id`),
  CONSTRAINT `FKah76pjwfflx2q114ixtihoa3g` FOREIGN KEY (`cabinet_place_id`) REFERENCES `cabinet_place` (`cabinet_place_id`)
) ENGINE=InnoDB AUTO_INCREMENT=399 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet`
--

LOCK TABLES `cabinet` WRITE;
/*!40000 ALTER TABLE `cabinet` DISABLE KEYS */;
INSERT INTO `cabinet` VALUES (1,0,0,'SHARE',3,'AVAILABLE','',89,5,'','',1),(2,1,0,'SHARE',3,'AVAILABLE','',90,5,'','',1),(3,2,0,'SHARE',3,'AVAILABLE','',91,5,'','',1),(4,3,0,'SHARE',3,'AVAILABLE','',92,5,'','',1),(5,4,0,'SHARE',3,'AVAILABLE','',93,5,'','',1),(6,5,0,'SHARE',3,'AVAILABLE','',94,5,'','',1),(7,6,0,'SHARE',3,'AVAILABLE','',95,5,'','',1),(8,7,0,'SHARE',3,'AVAILABLE','',96,5,'','',1),(9,8,0,'SHARE',3,'AVAILABLE','',97,5,'','',1),(10,9,0,'SHARE',3,'AVAILABLE','',98,5,'','',1),(11,10,0,'SHARE',3,'AVAILABLE','',99,5,'','',1),(12,11,0,'SHARE',3,'AVAILABLE','',100,5,'','',1),(13,12,0,'SHARE',3,'AVAILABLE','',101,5,'','',1),(14,0,1,'SHARE',3,'AVAILABLE','',102,5,'','',1),(15,1,1,'SHARE',3,'AVAILABLE','',103,5,'','',1),(16,2,1,'SHARE',3,'AVAILABLE','',104,5,'','',1),(17,3,1,'PRIVATE',1,'AVAILABLE','',105,5,'','',1),(18,4,1,'PRIVATE',1,'AVAILABLE','',106,5,'','',1),(19,5,1,'PRIVATE',1,'AVAILABLE','',107,5,'','',1),(20,6,1,'PRIVATE',1,'AVAILABLE','',108,5,'','',1),(21,7,1,'PRIVATE',1,'AVAILABLE','',109,5,'','',1),(22,8,1,'PRIVATE',1,'AVAILABLE','',110,5,'','',1),(23,9,1,'PRIVATE',1,'AVAILABLE','',111,5,'','',1),(24,10,1,'PRIVATE',1,'AVAILABLE','',112,5,'','',1),(25,11,1,'PRIVATE',1,'AVAILABLE','',113,5,'','',1),(26,12,1,'PRIVATE',1,'AVAILABLE','',114,5,'','',1),(27,0,2,'PRIVATE',1,'AVAILABLE','',115,5,'','',1),(28,1,2,'PRIVATE',1,'AVAILABLE','',116,5,'','',1),(29,2,2,'PRIVATE',1,'AVAILABLE','',117,5,'','',1),(30,3,2,'PRIVATE',1,'AVAILABLE','',118,5,'','',1),(31,4,2,'PRIVATE',1,'AVAILABLE','',119,5,'','',1),(32,5,2,'PRIVATE',1,'AVAILABLE','',120,5,'','',1),(33,6,2,'PRIVATE',1,'AVAILABLE','',121,5,'','',1),(34,7,2,'PRIVATE',1,'AVAILABLE','',122,5,'','',1),(35,8,2,'PRIVATE',1,'AVAILABLE','',123,5,'','',1),(36,9,2,'PRIVATE',1,'AVAILABLE','',124,5,'','',1),(37,10,2,'PRIVATE',1,'AVAILABLE','',125,5,'','',1),(38,11,2,'PRIVATE',1,'AVAILABLE','',126,5,'','',1),(39,12,2,'PRIVATE',1,'AVAILABLE','',127,5,'','',1),(40,0,3,'PRIVATE',1,'AVAILABLE','',128,5,'','',1),(41,1,3,'PRIVATE',1,'AVAILABLE','',129,5,'','',1),(42,2,3,'PRIVATE',1,'AVAILABLE','',130,5,'','',1),(43,3,3,'PRIVATE',1,'AVAILABLE','',131,5,'','',1),(44,4,3,'PRIVATE',1,'AVAILABLE','',132,5,'','',1),(45,5,3,'PRIVATE',1,'AVAILABLE','',133,5,'','',1),(46,6,3,'PRIVATE',1,'AVAILABLE','',134,5,'','',1),(47,7,3,'PRIVATE',1,'AVAILABLE','',135,5,'','',1),(48,8,3,'PRIVATE',1,'AVAILABLE','',136,5,'','',1),(49,9,3,'PRIVATE',1,'AVAILABLE','',137,5,'','',1),(50,10,3,'PRIVATE',1,'AVAILABLE','',138,5,'','',1),(51,11,3,'PRIVATE',1,'AVAILABLE','',139,5,'','',1),(52,12,3,'PRIVATE',1,'AVAILABLE','',140,5,'','',1),(53,0,0,'SHARE',3,'AVAILABLE','',141,6,'','',1),(54,1,0,'SHARE',3,'AVAILABLE','',142,6,'','',1),(55,0,1,'SHARE',3,'AVAILABLE','',143,6,'','',1),(56,1,1,'PRIVATE',1,'AVAILABLE','',144,6,'','',1),(57,0,2,'PRIVATE',1,'AVAILABLE','',145,6,'','',1),(58,1,2,'PRIVATE',1,'AVAILABLE','',146,6,'','',1),(59,0,3,'PRIVATE',1,'AVAILABLE','',147,6,'','',1),(60,1,3,'PRIVATE',1,'AVAILABLE','',148,6,'','',1),(61,0,0,'PRIVATE',1,'AVAILABLE','',17,2,'','',1),(62,1,0,'PRIVATE',1,'AVAILABLE','',18,2,'','',1),(63,2,0,'PRIVATE',1,'AVAILABLE','',19,2,'','',1),(64,3,0,'PRIVATE',1,'AVAILABLE','',20,2,'','',1),(65,4,0,'PRIVATE',1,'AVAILABLE','',21,2,'','',1),(66,0,1,'PRIVATE',1,'AVAILABLE','',22,2,'','',1),(67,1,1,'PRIVATE',1,'AVAILABLE','',23,2,'','',1),(68,2,1,'PRIVATE',1,'AVAILABLE','',24,2,'','',1),(69,3,1,'PRIVATE',1,'AVAILABLE','',25,2,'','',1),(70,4,1,'PRIVATE',1,'AVAILABLE','',26,2,'','',1),(71,0,2,'PRIVATE',1,'AVAILABLE','',27,2,'','',1),(72,1,2,'PRIVATE',1,'AVAILABLE','',28,2,'','',1),(73,2,2,'PRIVATE',1,'AVAILABLE','',29,2,'','',1),(74,3,2,'PRIVATE',1,'AVAILABLE','',30,2,'','',1),(75,4,2,'PRIVATE',1,'AVAILABLE','',31,2,'','',1),(76,0,3,'PRIVATE',1,'AVAILABLE','',32,2,'','',1),(77,1,3,'PRIVATE',1,'AVAILABLE','',33,2,'','',1),(78,2,3,'PRIVATE',1,'AVAILABLE','',34,2,'','',1),(79,3,3,'PRIVATE',1,'AVAILABLE','',35,2,'','',1),(80,4,3,'PRIVATE',1,'AVAILABLE','',36,2,'','',1),(81,0,0,'SHARE',3,'AVAILABLE','',1,1,'','',1),(82,1,0,'SHARE',3,'AVAILABLE','',2,1,'','',1),(83,2,0,'SHARE',3,'AVAILABLE','',3,1,'','',1),(84,3,0,'SHARE',3,'AVAILABLE','',4,1,'','',1),(85,0,1,'SHARE',3,'AVAILABLE','',5,1,'','',1),(86,1,1,'PRIVATE',1,'AVAILABLE','',6,1,'','',1),(87,2,1,'PRIVATE',1,'AVAILABLE','',7,1,'','',1),(88,3,1,'PRIVATE',1,'AVAILABLE','',8,1,'','',1),(89,0,2,'PRIVATE',1,'AVAILABLE','',9,1,'','',1),(90,1,2,'PRIVATE',1,'AVAILABLE','',10,1,'','',1),(91,2,2,'PRIVATE',1,'AVAILABLE','',11,1,'','',1),(92,3,2,'PRIVATE',1,'AVAILABLE','',12,1,'','',1),(93,0,3,'PRIVATE',1,'AVAILABLE','',13,1,'','',1),(94,1,3,'PRIVATE',1,'AVAILABLE','',14,1,'','',1),(95,2,3,'PRIVATE',1,'AVAILABLE','',15,1,'','',1),(96,3,3,'PRIVATE',1,'AVAILABLE','',16,1,'','',1),(97,0,0,'SHARE',3,'AVAILABLE','',37,3,'','',1),(98,1,0,'SHARE',3,'AVAILABLE','',38,3,'','',1),(99,2,0,'SHARE',3,'AVAILABLE','',39,3,'','',1),(100,3,0,'SHARE',3,'AVAILABLE','',40,3,'','',1),(101,4,0,'SHARE',3,'AVAILABLE','',41,3,'','',1),(102,5,0,'SHARE',3,'AVAILABLE','',42,3,'','',1),(103,6,0,'SHARE',3,'AVAILABLE','',43,3,'','',1),(104,7,0,'SHARE',3,'AVAILABLE','',44,3,'','',1),(105,0,1,'SHARE',3,'AVAILABLE','',45,3,'','',1),(106,1,1,'SHARE',3,'AVAILABLE','',46,3,'','',1),(107,2,1,'SHARE',3,'AVAILABLE','',47,3,'','',1),(108,3,1,'SHARE',3,'AVAILABLE','',48,3,'','',1),(109,4,1,'SHARE',3,'AVAILABLE','',49,3,'','',1),(110,5,1,'SHARE',3,'AVAILABLE','',50,3,'','',1),(111,6,1,'SHARE',3,'AVAILABLE','',51,3,'','',1),(112,7,1,'SHARE',3,'AVAILABLE','',52,3,'','',1),(113,0,2,'PRIVATE',1,'AVAILABLE','',53,3,'','',1),(114,1,2,'PRIVATE',1,'AVAILABLE','',54,3,'','',1),(115,2,2,'PRIVATE',1,'AVAILABLE','',55,3,'','',1),(116,3,2,'PRIVATE',1,'AVAILABLE','',56,3,'','',1),(117,4,2,'PRIVATE',1,'AVAILABLE','',57,3,'','',1),(118,5,2,'PRIVATE',1,'AVAILABLE','',58,3,'','',1),(119,6,2,'PRIVATE',1,'AVAILABLE','',59,3,'','',1),(120,7,2,'PRIVATE',1,'AVAILABLE','',60,3,'','',1),(121,0,3,'PRIVATE',1,'AVAILABLE','',61,3,'','',1),(122,1,3,'PRIVATE',1,'AVAILABLE','',62,3,'','',1),(123,2,3,'PRIVATE',1,'AVAILABLE','',63,3,'','',1),(124,3,3,'PRIVATE',1,'AVAILABLE','',64,3,'','',1),(125,4,3,'PRIVATE',1,'AVAILABLE','',65,3,'','',1),(126,5,3,'PRIVATE',1,'AVAILABLE','',66,3,'','',1),(127,6,3,'PRIVATE',1,'AVAILABLE','',67,3,'','',1),(128,7,3,'PRIVATE',1,'AVAILABLE','',68,3,'','',1),(129,0,0,'PRIVATE',1,'AVAILABLE','',69,4,'','',1),(130,1,0,'PRIVATE',1,'AVAILABLE','',70,4,'','',1),(131,2,0,'PRIVATE',1,'AVAILABLE','',71,4,'','',1),(132,3,0,'PRIVATE',1,'AVAILABLE','',72,4,'','',1),(133,4,0,'PRIVATE',1,'AVAILABLE','',73,4,'','',1),(134,0,1,'PRIVATE',1,'AVAILABLE','',74,4,'','',1),(135,1,1,'PRIVATE',1,'AVAILABLE','',75,4,'','',1),(136,2,1,'PRIVATE',1,'AVAILABLE','',76,4,'','',1),(137,3,1,'PRIVATE',1,'AVAILABLE','',77,4,'','',1),(138,4,1,'PRIVATE',1,'AVAILABLE','',78,4,'','',1),(139,0,2,'PRIVATE',1,'AVAILABLE','',79,4,'','',1),(140,1,2,'PRIVATE',1,'AVAILABLE','',80,4,'','',1),(141,2,2,'PRIVATE',1,'AVAILABLE','',81,4,'','',1),(142,3,2,'PRIVATE',1,'AVAILABLE','',82,4,'','',1),(143,4,2,'PRIVATE',1,'AVAILABLE','',83,4,'','',1),(144,0,3,'PRIVATE',1,'AVAILABLE','',84,4,'','',1),(145,1,3,'PRIVATE',1,'AVAILABLE','',85,4,'','',1),(146,2,3,'PRIVATE',1,'AVAILABLE','',86,4,'','',1),(147,3,3,'PRIVATE',1,'AVAILABLE','',87,4,'','',1),(148,4,3,'PRIVATE',1,'AVAILABLE','',88,4,'','',1),(149,0,0,'SHARE',3,'AVAILABLE','',37,16,'','',1),(150,1,0,'SHARE',3,'AVAILABLE','',38,16,'','',1),(151,2,0,'SHARE',3,'AVAILABLE','',39,16,'','',1),(152,3,0,'SHARE',3,'AVAILABLE','',40,16,'','',1),(153,4,0,'SHARE',3,'AVAILABLE','',41,16,'','',1),(154,5,0,'SHARE',3,'AVAILABLE','',42,16,'','',1),(155,6,0,'SHARE',3,'AVAILABLE','',43,16,'','',1),(156,7,0,'SHARE',3,'AVAILABLE','',44,16,'','',1),(157,8,0,'SHARE',3,'AVAILABLE','',45,16,'','',1),(158,9,0,'SHARE',3,'AVAILABLE','',46,16,'','',1),(159,10,0,'SHARE',3,'AVAILABLE','',47,16,'','',1),(160,11,0,'SHARE',3,'AVAILABLE','',48,16,'','',1),(161,12,0,'SHARE',3,'AVAILABLE','',49,16,'','',1),(162,0,1,'SHARE',3,'AVAILABLE','',50,16,'','',1),(163,1,1,'SHARE',3,'AVAILABLE','',51,16,'','',1),(164,2,1,'SHARE',3,'AVAILABLE','',52,16,'','',1),(165,3,1,'PRIVATE',1,'AVAILABLE','',53,16,'','',1),(166,4,1,'PRIVATE',1,'AVAILABLE','',54,16,'','',1),(167,5,1,'PRIVATE',1,'AVAILABLE','',55,16,'','',1),(168,6,1,'PRIVATE',1,'AVAILABLE','',56,16,'','',1),(169,7,1,'PRIVATE',1,'AVAILABLE','',57,16,'','',1),(170,8,1,'PRIVATE',1,'AVAILABLE','',58,16,'','',1),(171,9,1,'PRIVATE',1,'AVAILABLE','',59,16,'','',1),(172,10,1,'PRIVATE',1,'AVAILABLE','',60,16,'','',1),(173,11,1,'PRIVATE',1,'AVAILABLE','',61,16,'','',1),(174,12,1,'PRIVATE',1,'AVAILABLE','',62,16,'','',1),(175,0,2,'PRIVATE',1,'AVAILABLE','',63,16,'','',1),(176,1,2,'PRIVATE',1,'AVAILABLE','',64,16,'','',1),(177,2,2,'PRIVATE',1,'AVAILABLE','',65,16,'','',1),(178,3,2,'PRIVATE',1,'AVAILABLE','',66,16,'','',1),(179,4,2,'PRIVATE',1,'AVAILABLE','',67,16,'','',1),(180,5,2,'PRIVATE',1,'AVAILABLE','',68,16,'','',1),(181,6,2,'PRIVATE',1,'AVAILABLE','',69,16,'','',1),(182,7,2,'PRIVATE',1,'AVAILABLE','',70,16,'','',1),(183,8,2,'PRIVATE',1,'AVAILABLE','',71,16,'','',1),(184,9,2,'PRIVATE',1,'AVAILABLE','',72,16,'','',1),(185,10,2,'PRIVATE',1,'AVAILABLE','',73,16,'','',1),(186,11,2,'PRIVATE',1,'AVAILABLE','',74,16,'','',1),(187,12,2,'PRIVATE',1,'AVAILABLE','',75,16,'','',1),(188,0,3,'PRIVATE',1,'AVAILABLE','',76,16,'','',1),(189,1,3,'PRIVATE',1,'AVAILABLE','',77,16,'','',1),(190,2,3,'PRIVATE',1,'AVAILABLE','',78,16,'','',1),(191,3,3,'PRIVATE',1,'AVAILABLE','',79,16,'','',1),(192,4,3,'PRIVATE',1,'AVAILABLE','',80,16,'','',1),(193,5,3,'PRIVATE',1,'AVAILABLE','',81,16,'','',1),(194,6,3,'PRIVATE',1,'AVAILABLE','',82,16,'','',1),(195,7,3,'PRIVATE',1,'AVAILABLE','',83,16,'','',1),(196,8,3,'PRIVATE',1,'AVAILABLE','',84,16,'','',1),(197,9,3,'PRIVATE',1,'AVAILABLE','',85,16,'','',1),(198,10,3,'PRIVATE',1,'AVAILABLE','',86,16,'','',1),(199,11,3,'PRIVATE',1,'AVAILABLE','',87,16,'','',1),(200,12,3,'PRIVATE',1,'AVAILABLE','',88,16,'','',1),(201,0,0,'SHARE',3,'AVAILABLE','',89,17,'','',1),(202,1,0,'SHARE',3,'AVAILABLE','',90,17,'','',1),(203,2,0,'SHARE',3,'AVAILABLE','',91,17,'','',1),(204,0,1,'SHARE',3,'AVAILABLE','',92,17,'','',1),(205,1,1,'PRIVATE',1,'AVAILABLE','',93,17,'','',1),(206,2,1,'PRIVATE',1,'AVAILABLE','',94,17,'','',1),(207,0,2,'PRIVATE',1,'AVAILABLE','',95,17,'','',1),(208,1,2,'PRIVATE',1,'AVAILABLE','',96,17,'','',1),(209,2,2,'PRIVATE',1,'AVAILABLE','',97,17,'','',1),(210,0,3,'PRIVATE',1,'AVAILABLE','',98,17,'','',1),(211,1,3,'PRIVATE',1,'AVAILABLE','',99,17,'','',1),(212,2,3,'PRIVATE',1,'AVAILABLE','',100,17,'','',1),(213,0,0,'SHARE',3,'AVAILABLE','',17,15,'','',1),(214,1,0,'SHARE',3,'AVAILABLE','',18,15,'','',1),(215,2,0,'SHARE',3,'AVAILABLE','',19,15,'','',1),(216,3,0,'SHARE',3,'AVAILABLE','',20,15,'','',1),(217,4,0,'SHARE',3,'AVAILABLE','',21,15,'','',1),(218,0,1,'SHARE',3,'AVAILABLE','',22,15,'','',1),(219,1,1,'PRIVATE',1,'AVAILABLE','',23,15,'','',1),(220,2,1,'PRIVATE',1,'AVAILABLE','',24,15,'','',1),(221,3,1,'PRIVATE',1,'AVAILABLE','',25,15,'','',1),(222,4,1,'PRIVATE',1,'AVAILABLE','',26,15,'','',1),(223,0,2,'PRIVATE',1,'AVAILABLE','',27,15,'','',1),(224,1,2,'PRIVATE',1,'AVAILABLE','',28,15,'','',1),(225,2,2,'PRIVATE',1,'AVAILABLE','',29,15,'','',1),(226,3,2,'PRIVATE',1,'AVAILABLE','',30,15,'','',1),(227,4,2,'PRIVATE',1,'AVAILABLE','',31,15,'','',1),(228,0,3,'PRIVATE',1,'AVAILABLE','',32,15,'','',1),(229,1,3,'PRIVATE',1,'AVAILABLE','',33,15,'','',1),(230,2,3,'PRIVATE',1,'AVAILABLE','',34,15,'','',1),(231,3,3,'PRIVATE',1,'AVAILABLE','',35,15,'','',1),(232,4,3,'PRIVATE',1,'AVAILABLE','',36,15,'','',1),(233,0,0,'SHARE',3,'AVAILABLE','',1,14,'','',1),(234,1,0,'SHARE',3,'AVAILABLE','',2,14,'','',1),(235,2,0,'SHARE',3,'AVAILABLE','',3,14,'','',1),(236,3,0,'SHARE',3,'AVAILABLE','',4,14,'','',1),(237,0,1,'SHARE',3,'AVAILABLE','',5,14,'','',1),(238,1,1,'PRIVATE',1,'AVAILABLE','',6,14,'','',1),(239,2,1,'PRIVATE',1,'AVAILABLE','',7,14,'','',1),(240,3,1,'PRIVATE',1,'AVAILABLE','',8,14,'','',1),(241,0,2,'PRIVATE',1,'AVAILABLE','',9,14,'','',1),(242,1,2,'PRIVATE',1,'AVAILABLE','',10,14,'','',1),(243,2,2,'PRIVATE',1,'AVAILABLE','',11,14,'','',1),(244,3,2,'PRIVATE',1,'AVAILABLE','',12,14,'','',1),(245,0,3,'PRIVATE',1,'AVAILABLE','',13,14,'','',1),(246,1,3,'PRIVATE',1,'AVAILABLE','',14,14,'','',1),(247,2,3,'PRIVATE',1,'AVAILABLE','',15,14,'','',1),(248,3,3,'PRIVATE',1,'AVAILABLE','',16,14,'','',1),(249,0,0,'SHARE',3,'AVAILABLE','',37,20,'','',1),(250,1,0,'SHARE',3,'AVAILABLE','',38,20,'','',1),(251,2,0,'SHARE',3,'AVAILABLE','',39,20,'','',1),(252,3,0,'SHARE',3,'AVAILABLE','',40,20,'','',1),(253,4,0,'SHARE',3,'AVAILABLE','',41,20,'','',1),(254,5,0,'SHARE',3,'AVAILABLE','',42,20,'','',1),(255,6,0,'SHARE',3,'AVAILABLE','',43,20,'','',1),(256,7,0,'SHARE',3,'AVAILABLE','',44,20,'','',1),(257,8,0,'SHARE',3,'AVAILABLE','',45,20,'','',1),(258,9,0,'SHARE',3,'AVAILABLE','',46,20,'','',1),(259,10,0,'SHARE',3,'AVAILABLE','',47,20,'','',1),(260,11,0,'SHARE',3,'AVAILABLE','',48,20,'','',1),(261,12,0,'SHARE',3,'AVAILABLE','',49,20,'','',1),(262,0,1,'SHARE',3,'AVAILABLE','',50,20,'','',1),(263,1,1,'SHARE',3,'AVAILABLE','',51,20,'','',1),(264,2,1,'SHARE',3,'AVAILABLE','',52,20,'','',1),(265,3,1,'PRIVATE',1,'AVAILABLE','',53,20,'','',1),(266,4,1,'PRIVATE',1,'AVAILABLE','',54,20,'','',1),(267,5,1,'PRIVATE',1,'AVAILABLE','',55,20,'','',1),(268,6,1,'PRIVATE',1,'AVAILABLE','',56,20,'','',1),(269,7,1,'PRIVATE',1,'AVAILABLE','',57,20,'','',1),(270,8,1,'PRIVATE',1,'AVAILABLE','',58,20,'','',1),(271,9,1,'PRIVATE',1,'AVAILABLE','',59,20,'','',1),(272,10,1,'PRIVATE',1,'AVAILABLE','',60,20,'','',1),(273,11,1,'PRIVATE',1,'AVAILABLE','',61,20,'','',1),(274,12,1,'PRIVATE',1,'AVAILABLE','',62,20,'','',1),(275,0,2,'PRIVATE',1,'AVAILABLE','',63,20,'','',1),(276,1,2,'PRIVATE',1,'AVAILABLE','',64,20,'','',1),(277,2,2,'PRIVATE',1,'AVAILABLE','',65,20,'','',1),(278,3,2,'PRIVATE',1,'AVAILABLE','',66,20,'','',1),(279,4,2,'PRIVATE',1,'AVAILABLE','',67,20,'','',1),(280,5,2,'PRIVATE',1,'AVAILABLE','',68,20,'','',1),(281,6,2,'PRIVATE',1,'AVAILABLE','',69,20,'','',1),(282,7,2,'PRIVATE',1,'AVAILABLE','',70,20,'','',1),(283,8,2,'PRIVATE',1,'AVAILABLE','',71,20,'','',1),(284,9,2,'PRIVATE',1,'AVAILABLE','',72,20,'','',1),(285,10,2,'PRIVATE',1,'AVAILABLE','',73,20,'','',1),(286,11,2,'PRIVATE',1,'AVAILABLE','',74,20,'','',1),(287,12,2,'PRIVATE',1,'AVAILABLE','',75,20,'','',1),(288,0,3,'PRIVATE',1,'AVAILABLE','',76,20,'','',1),(289,1,3,'PRIVATE',1,'AVAILABLE','',77,20,'','',1),(290,2,3,'PRIVATE',1,'AVAILABLE','',78,20,'','',1),(291,3,3,'PRIVATE',1,'AVAILABLE','',79,20,'','',1),(292,4,3,'PRIVATE',1,'AVAILABLE','',80,20,'','',1),(293,5,3,'PRIVATE',1,'AVAILABLE','',81,20,'','',1),(294,6,3,'PRIVATE',1,'AVAILABLE','',82,20,'','',1),(295,7,3,'PRIVATE',1,'AVAILABLE','',83,20,'','',1),(296,8,3,'PRIVATE',1,'AVAILABLE','',84,20,'','',1),(297,9,3,'PRIVATE',1,'AVAILABLE','',85,20,'','',1),(298,10,3,'PRIVATE',1,'AVAILABLE','',86,20,'','',1),(299,11,3,'PRIVATE',1,'AVAILABLE','',87,20,'','',1),(300,12,3,'PRIVATE',1,'AVAILABLE','',88,20,'','',1),(301,0,0,'SHARE',3,'AVAILABLE','',17,19,'','',1),(302,1,0,'SHARE',3,'AVAILABLE','',18,19,'','',1),(303,2,0,'SHARE',3,'AVAILABLE','',19,19,'','',1),(304,3,0,'SHARE',3,'AVAILABLE','',20,19,'','',1),(305,4,0,'SHARE',3,'AVAILABLE','',21,19,'','',1),(306,0,1,'SHARE',3,'AVAILABLE','',22,19,'','',1),(307,1,1,'PRIVATE',1,'AVAILABLE','',23,19,'','',1),(308,2,1,'PRIVATE',1,'AVAILABLE','',24,19,'','',1),(309,3,1,'PRIVATE',1,'AVAILABLE','',25,19,'','',1),(310,4,1,'PRIVATE',1,'AVAILABLE','',26,19,'','',1),(311,0,2,'PRIVATE',1,'AVAILABLE','',27,19,'','',1),(312,1,2,'PRIVATE',1,'AVAILABLE','',28,19,'','',1),(313,2,2,'PRIVATE',1,'AVAILABLE','',29,19,'','',1),(314,3,2,'PRIVATE',1,'AVAILABLE','',30,19,'','',1),(315,4,2,'PRIVATE',1,'AVAILABLE','',31,19,'','',1),(316,0,3,'PRIVATE',1,'AVAILABLE','',32,19,'','',1),(317,1,3,'PRIVATE',1,'AVAILABLE','',33,19,'','',1),(318,2,3,'PRIVATE',1,'AVAILABLE','',34,19,'','',1),(319,3,3,'PRIVATE',1,'AVAILABLE','',35,19,'','',1),(320,4,3,'PRIVATE',1,'AVAILABLE','',36,19,'','',1),(321,0,0,'SHARE',3,'AVAILABLE','',1,18,'','',1),(322,1,0,'SHARE',3,'AVAILABLE','',2,18,'','',1),(323,2,0,'SHARE',3,'AVAILABLE','',3,18,'','',1),(324,3,0,'SHARE',3,'AVAILABLE','',4,18,'','',1),(325,0,1,'SHARE',3,'AVAILABLE','',5,18,'','',1),(326,1,1,'PRIVATE',1,'AVAILABLE','',6,18,'','',1),(327,2,1,'PRIVATE',1,'AVAILABLE','',7,18,'','',1),(328,3,1,'PRIVATE',1,'AVAILABLE','',8,18,'','',1),(329,0,2,'PRIVATE',1,'AVAILABLE','',9,18,'','',1),(330,1,2,'PRIVATE',1,'AVAILABLE','',10,18,'','',1),(331,2,2,'PRIVATE',1,'AVAILABLE','',11,18,'','',1),(332,3,2,'PRIVATE',1,'AVAILABLE','',12,18,'','',1),(333,0,3,'PRIVATE',1,'AVAILABLE','',13,18,'','',1),(334,1,3,'PRIVATE',1,'AVAILABLE','',14,18,'','',1),(335,2,3,'PRIVATE',1,'AVAILABLE','',15,18,'','',1),(336,3,3,'PRIVATE',1,'AVAILABLE','',16,18,'','',1),(337,0,0,'SHARE',3,'AVAILABLE','',89,21,'','',1),(338,1,0,'SHARE',3,'AVAILABLE','',90,21,'','',1),(339,0,1,'SHARE',3,'AVAILABLE','',91,21,'','',1),(340,1,1,'SHARE',3,'AVAILABLE','',92,21,'','',1),(341,0,2,'PRIVATE',1,'AVAILABLE','',93,21,'','',1),(342,1,2,'PRIVATE',1,'AVAILABLE','',94,21,'','',1),(343,0,3,'PRIVATE',1,'AVAILABLE','',95,21,'','',1),(344,1,3,'PRIVATE',1,'AVAILABLE','',96,21,'','',1),(345,0,0,'CLUB',1,'AVAILABLE','',1,7,'','',1),(346,1,0,'CLUB',1,'AVAILABLE','',2,7,'','',1),(347,2,0,'CLUB',1,'AVAILABLE','',3,7,'','',1),(348,3,0,'CLUB',1,'AVAILABLE','',4,7,'','',1),(349,0,1,'CLUB',1,'AVAILABLE','',5,7,'','',1),(350,1,1,'CLUB',1,'AVAILABLE','',6,7,'','',1),(351,2,1,'CLUB',1,'AVAILABLE','',7,7,'','',1),(352,3,1,'CLUB',1,'AVAILABLE','',8,7,'','',1),(353,0,0,'CLUB',1,'AVAILABLE','',9,8,'','',1),(354,1,0,'CLUB',1,'AVAILABLE','',10,8,'','',1),(355,2,0,'CLUB',1,'AVAILABLE','',11,8,'','',1),(356,3,0,'CLUB',1,'AVAILABLE','',12,8,'','',1),(357,0,1,'CLUB',1,'AVAILABLE','',13,8,'','',1),(358,1,1,'CLUB',1,'AVAILABLE','',14,8,'','',1),(359,2,1,'CLUB',1,'AVAILABLE','',15,8,'','',1),(360,3,1,'CLUB',1,'AVAILABLE','',16,8,'','',1),(361,0,0,'CLUB',1,'AVAILABLE','',17,9,'','',1),(362,1,0,'CLUB',1,'AVAILABLE','',18,9,'','',1),(363,2,0,'CLUB',1,'AVAILABLE','',19,9,'','',1),(364,3,0,'CLUB',1,'AVAILABLE','',20,9,'','',1),(365,0,1,'CLUB',1,'AVAILABLE','',21,9,'','',1),(366,1,1,'CLUB',1,'AVAILABLE','',22,9,'','',1),(367,2,1,'CLUB',1,'AVAILABLE','',23,9,'','',1),(368,3,1,'CLUB',1,'AVAILABLE','',24,9,'','',1),(369,0,0,'CLUB',1,'AVAILABLE','',25,10,'','',1),(370,1,0,'SHARE',3,'AVAILABLE','',26,10,'','',1),(371,2,0,'SHARE',3,'AVAILABLE','',27,10,'','',1),(372,3,0,'SHARE',3,'AVAILABLE','',28,10,'','',1),(373,0,1,'CLUB',1,'AVAILABLE','',29,10,'','',1),(374,1,1,'PRIVATE',1,'AVAILABLE','',30,10,'','',1),(375,2,1,'PRIVATE',1,'AVAILABLE','',31,10,'','',1),(376,3,1,'PRIVATE',1,'AVAILABLE','',32,10,'','',1),(377,0,0,'SHARE',3,'AVAILABLE','',33,11,'','',1),(378,1,0,'SHARE',3,'AVAILABLE','',34,11,'','',1),(379,2,0,'SHARE',3,'AVAILABLE','',35,11,'','',1),(380,3,0,'SHARE',3,'AVAILABLE','',36,11,'','',1),(381,0,1,'PRIVATE',1,'AVAILABLE','',37,11,'','',1),(382,1,1,'PRIVATE',1,'AVAILABLE','',38,11,'','',1),(383,2,1,'PRIVATE',1,'AVAILABLE','',39,11,'','',1),(384,3,1,'PRIVATE',1,'AVAILABLE','',40,11,'','',1),(385,0,0,'SHARE',3,'AVAILABLE','',41,12,'','',1),(386,1,0,'SHARE',3,'AVAILABLE','',42,12,'','',1),(387,2,0,'SHARE',3,'AVAILABLE','',43,12,'','',1),(388,3,0,'SHARE',3,'AVAILABLE','',44,12,'','',1),(389,0,1,'PRIVATE',1,'AVAILABLE','',45,12,'','',1),(390,1,1,'PRIVATE',1,'AVAILABLE','',46,12,'','',1),(391,2,1,'PRIVATE',1,'AVAILABLE','',47,12,'','',1),(392,3,1,'PRIVATE',1,'AVAILABLE','',48,12,'','',1),(393,0,0,'SHARE',3,'AVAILABLE','',49,13,'','',1),(394,1,0,'SHARE',3,'AVAILABLE','',50,13,'','',1),(395,2,0,'SHARE',3,'AVAILABLE','',51,13,'','',1),(396,0,1,'PRIVATE',1,'AVAILABLE','',52,13,'','',1),(397,1,1,'PRIVATE',1,'AVAILABLE','',53,13,'','',1),(398,2,1,'PRIVATE',1,'AVAILABLE','',54,13,'','',1);
/*!40000 ALTER TABLE `cabinet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabinet_place`
--

DROP TABLE IF EXISTS `cabinet_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabinet_place` (
  `cabinet_place_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `height` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `building` varchar(255) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `end_x` int(11) DEFAULT NULL,
  `end_y` int(11) DEFAULT NULL,
  `start_x` int(11) DEFAULT NULL,
  `start_y` int(11) DEFAULT NULL,
  PRIMARY KEY (`cabinet_place_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet_place`
--

LOCK TABLES `cabinet_place` WRITE;
/*!40000 ALTER TABLE `cabinet_place` DISABLE KEYS */;
INSERT INTO `cabinet_place` VALUES (1,4,4,'새롬관',2,'End of Cluster 1',0,0,0,0),(2,4,5,'새롬관',2,'Cluster 1 - OA',0,0,0,0),(3,4,8,'새롬관',2,'Cluster 1 - Terrace1',0,0,0,0),(4,4,5,'새롬관',2,'Cluster 1 - Terrace2',0,0,0,0),(5,4,13,'새롬관',2,'Oasis',0,0,0,0),(6,4,2,'새롬관',2,'End of Cluster 2',0,0,0,0),(7,2,4,'새롬관',3,'Cluster X - 1',0,0,0,0),(8,2,4,'새롬관',3,'Cluster X - 2',0,0,0,0),(9,2,4,'새롬관',3,'Cluster X - 3',0,0,0,0),(10,2,4,'새롬관',3,'Cluster X - 4',0,0,0,0),(11,2,4,'새롬관',3,'Cluster X - 5',0,0,0,0),(12,2,4,'새롬관',3,'Cluster X - 6',0,0,0,0),(13,2,3,'새롬관',3,'Cluster X - 7',0,0,0,0),(14,4,4,'새롬관',4,'End of Cluster 3',0,0,0,0),(15,4,5,'새롬관',4,'Cluster 3 - OA',0,0,0,0),(16,4,13,'새롬관',4,'Oasis',0,0,0,0),(17,4,3,'새롬관',4,'End of Cluster 4',0,0,0,0),(18,4,4,'새롬관',5,'End of Cluster 5',0,0,0,0),(19,4,5,'새롬관',5,'Cluster 5 - OA',0,0,0,0),(20,4,13,'새롬관',5,'Oasis',0,0,0,0),(21,4,2,'새롬관',5,'End of Cluster 6',0,0,0,0);
/*!40000 ALTER TABLE `cabinet_place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lent_history`
--

DROP TABLE IF EXISTS `lent_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lent_history` (
  `lent_history_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ended_at` datetime(6) DEFAULT NULL,
  `expired_at` datetime(6) DEFAULT NULL,
  `started_at` datetime(6) NOT NULL,
  `cabinet_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `version` bigint(20) NOT NULL DEFAULT 1,
  PRIMARY KEY (`lent_history_id`),
  KEY `lent_history_cabinet_id` (`cabinet_id`),
  KEY `lent_history_user_id` (`user_id`),
  CONSTRAINT `lent_history_cabinet_id` FOREIGN KEY (`cabinet_id`) REFERENCES `cabinet` (`cabinet_id`),
  CONSTRAINT `lent_history_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent_history`
--

LOCK TABLES `lent_history` WRITE;
/*!40000 ALTER TABLE `lent_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `lent_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `blackholed_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(32) NOT NULL,
  `role` varchar(32) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_gj2fy3dcix7ph7k8684gka40c` (`name`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `lent_extension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lent_extension`
(
    `lent_extension_id` bigint auto_increment,
    `user_id`           bigint      not null,
    `name`              varchar(64) not null,
    `extension_period`  int         not null,
    `expired_at`        datetime(6) not null,
    `type`              varchar(32) not null,
    PRIMARY KEY (lent_extension_id),
    CONSTRAINT lent_extension_user_user_id_fk
        FOREIGN KEY (user_id) REFERENCES user (user_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-18 22:56:47
