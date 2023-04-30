-- MySQL dump 10.13  Distrib 8.0.32, for macos13.0 (arm64)
--
-- Host: 127.0.0.1    Database: cabi_new
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.2-MariaDB-1:10.11.2+maria~ubu2204

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` VALUES (1,'admin0@gmail.com','NONE'),(2,'admin1@gmail.com','ADMIN'),(3,'admin2@gamil.com','MASTER');
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
  `cabinet_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`ban_history_id`),
  KEY `FKh2q9qu6ruyjwlxe8ut7cb5wb9` (`cabinet_id`),
  KEY `FKn0s4q3cllg207pni4as71face` (`user_id`),
  CONSTRAINT `FKh2q9qu6ruyjwlxe8ut7cb5wb9` FOREIGN KEY (`cabinet_id`) REFERENCES `cabinet` (`cabinet_id`),
  CONSTRAINT `FKn0s4q3cllg207pni4as71face` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ban_history`
--

LOCK TABLES `ban_history` WRITE;
/*!40000 ALTER TABLE `ban_history` DISABLE KEYS */;
INSERT INTO `ban_history` VALUES (1,'PRIVATE','2023-01-14 17:32:13.000000','2023-01-15 17:32:13.000000',2,1),(2,'SHARE','2023-01-14 17:32:45.000000','2023-01-17 17:32:45.000000',2,3);
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
  PRIMARY KEY (`cabinet_id`),
  KEY `FKah76pjwfflx2q114ixtihoa3g` (`cabinet_place_id`),
  CONSTRAINT `FKah76pjwfflx2q114ixtihoa3g` FOREIGN KEY (`cabinet_place_id`) REFERENCES `cabinet_place` (`cabinet_place_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet`
--

LOCK TABLES `cabinet` WRITE;
/*!40000 ALTER TABLE `cabinet` DISABLE KEYS */;
INSERT INTO `cabinet` VALUES (1,0,0,'PRIVATE',1,'BROKEN',NULL,1,1),(2,1,0,'SHARE',3,'BROKEN',NULL,2,1),(3,0,0,'PRIVATE',1,'FULL',NULL,3,2),(4,1,0,'SHARE',3,'FULL',NULL,4,2),(5,0,0,'PRIVATE',1,'OVERDUE',NULL,5,3),(6,1,0,'SHARE',3,'OVERDUE',NULL,6,3),(7,0,0,'PRIVATE',1,'AVAILABLE',NULL,7,4),(8,1,0,'SHARE',3,'AVAILABLE',NULL,8,4),(9,0,0,'CLUB',1,'FULL',NULL,9,5),(10,1,0,'CLUB',1,'AVAILABLE',NULL,10,5),(11,0,0,'PRIVATE',1,'AVAILABLE',NULL,11,6),(12,1,0,'SHARE',3,'AVAILABLE',NULL,12,6),(13,0,0,'PRIVATE',1,'AVAILABLE',NULL,13,7),(14,1,0,'SHARE',3,'AVAILABLE',NULL,14,7),(15,0,0,'PRIVATE',1,'AVAILABLE',NULL,15,8),(16,1,0,'SHARE',3,'LIMITED_AVAILABLE',NULL,16,8),(17,0,0,'PRIVATE',1,'AVAILABLE',NULL,17,9),(18,1,0,'SHARE',3,'LIMITED_AVAILABLE',NULL,18,9),(19,0,0,'PRIVATE',1,'AVAILABLE',NULL,19,10),(20,1,0,'SHARE',3,'AVAILABLE',NULL,20,10),(21,0,0,'PRIVATE',1,'AVAILABLE',NULL,21,11),(22,1,0,'SHARE',3,'AVAILABLE',NULL,22,11),(23,0,0,'PRIVATE',1,'AVAILABLE',NULL,23,12),(24,1,0,'SHARE',3,'AVAILABLE',NULL,24,12),(25,0,0,'PRIVATE',1,'AVAILABLE',NULL,25,13),(26,1,0,'SHARE',3,'AVAILABLE',NULL,26,13),(27,0,0,'PRIVATE',1,'AVAILABLE',NULL,27,14),(28,1,0,'SHARE',3,'AVAILABLE',NULL,28,14);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet_place`
--

LOCK TABLES `cabinet_place` WRITE;
/*!40000 ALTER TABLE `cabinet_place` DISABLE KEYS */;
INSERT INTO `cabinet_place` VALUES (1,1,2,'새롬관',2,'Oasis',10,10,0,0),(2,1,2,'새롬관',2,'End of Cluster 1',20,20,10,10),(3,1,2,'새롬관',2,'Cluster 1 - OA',30,30,20,20),(4,1,2,'새롬관',2,'End of Cluster 2',40,40,30,30),(5,1,2,'새롬관',3,'Cluster X - 1',10,10,0,0),(6,1,2,'새롬관',3,'Cluster X - 2',20,20,10,10),(7,1,2,'새롬관',4,'Oasis',10,10,0,0),(8,1,2,'새롬관',4,'End of Cluster 3',20,20,10,10),(9,1,2,'새롬관',4,'Cluster 3 - OA',30,30,20,20),(10,1,2,'새롬관',4,'End of Cluster 4',40,40,30,30),(11,1,2,'새롬관',5,'Oasis',10,10,0,0),(12,1,2,'새롬관',5,'End of Cluster 5',20,20,10,10),(13,1,2,'새롬관',5,'Cluster 5 - OA',30,30,20,20),(14,1,2,'새롬관',5,'End of Cluster 6',40,40,30,30);
/*!40000 ALTER TABLE `cabinet_place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lent_cabinet_detail`
--

DROP TABLE IF EXISTS `lent_cabinet_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lent_cabinet_detail` (
  `lent_cabinet_detail_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `memo` varchar(64) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`lent_cabinet_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent_cabinet_detail`
--

LOCK TABLES `lent_cabinet_detail` WRITE;
/*!40000 ALTER TABLE `lent_cabinet_detail` DISABLE KEYS */;
INSERT INTO `lent_cabinet_detail` VALUES (1,'메롱',NULL),(2,'1234',NULL),(3,NULL,NULL),(4,'0000',NULL),(5,NULL,NULL),(6,NULL,NULL),(7,NULL,NULL),(8,NULL,NULL),(9,NULL,NULL),(10,NULL,NULL),(11,NULL,NULL),(12,NULL,NULL),(13,NULL,NULL),(14,NULL,NULL),(15,NULL,NULL),(16,NULL,NULL),(17,NULL,NULL),(18,NULL,NULL),(19,NULL,NULL),(20,NULL,NULL),(21,NULL,NULL),(22,NULL,NULL),(23,NULL,NULL),(24,NULL,NULL);
/*!40000 ALTER TABLE `lent_cabinet_detail` ENABLE KEYS */;
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
  `lent_cabinet_detail_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`lent_history_id`),
  KEY `FK65rj7u9eih0x63rpeyoq5gp2h` (`cabinet_id`),
  KEY `FKjmwsh1afqsc9qrb11qcg0jeip` (`lent_cabinet_detail_id`),
  KEY `FKp4gd80p8ruvkxqvxhqpy37wvu` (`user_id`),
  CONSTRAINT `FK65rj7u9eih0x63rpeyoq5gp2h` FOREIGN KEY (`cabinet_id`) REFERENCES `cabinet` (`cabinet_id`),
  CONSTRAINT `FKjmwsh1afqsc9qrb11qcg0jeip` FOREIGN KEY (`lent_cabinet_detail_id`) REFERENCES `lent_cabinet_detail` (`lent_cabinet_detail_id`),
  CONSTRAINT `FKp4gd80p8ruvkxqvxhqpy37wvu` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent_history`
--

LOCK TABLES `lent_history` WRITE;
/*!40000 ALTER TABLE `lent_history` DISABLE KEYS */;
INSERT INTO `lent_history` VALUES (1,'2022-07-01 00:40:08.000000','2022-07-02 00:40:08.000000','2022-06-29 00:40:50.000000',3,3,5),(2,'2022-07-02 00:40:08.000000','2022-07-03 00:40:08.000000','2022-07-01 00:40:08.000000',3,3,5),(3,'2022-07-04 00:40:08.000000','2022-07-05 00:40:08.000000','2022-07-03 01:40:08.000000',3,3,5),(4,'2022-07-07 00:40:08.000000','2022-07-08 00:40:08.000000','2022-07-03 01:40:08.000000',3,3,5),(5,'2022-07-10 00:40:08.000000','2022-07-11 00:40:08.000000','2022-07-09 01:40:08.000000',3,3,5),(6,'2022-07-13 00:40:08.000000','2022-07-14 00:40:08.000000','2022-07-12 00:40:50.000000',4,4,5),(7,'2022-07-17 00:40:08.000000','2022-07-18 00:40:08.000000','2022-07-16 00:40:08.000000',4,4,5),(8,'2022-07-20 00:40:08.000000','2022-07-21 00:40:08.000000','2022-07-19 01:40:08.000000',4,4,5),(9,'2022-07-23 00:40:08.000000','2022-07-24 00:40:08.000000','2022-07-22 01:40:08.000000',4,4,5),(10,'2022-07-26 00:40:08.000000','2022-07-27 00:40:08.000000','2022-07-25 01:40:08.000000',4,4,5),(11,'2022-07-30 00:40:08.000000','2022-07-31 00:40:08.000000','2022-07-28 01:40:08.000000',5,5,5),(13,'2023-01-14 01:04:29.000000','2023-01-13 23:59:59.000000','2022-12-24 23:59:59.000000',2,2,1),(14,'2023-01-14 01:07:28.000000','2023-02-23 23:59:59.000000','2023-01-14 00:07:43.000000',2,2,3),(15,NULL,'2023-01-22 23:59:59.000000','2023-01-01 23:55:59.000000',3,3,5),(16,NULL,'2023-01-13 23:59:59.000000','2022-12-24 18:59:59.000000',5,5,6),(17,NULL,'9999-12-31 23:59:59.000000','2023-01-03 22:59:05.000000',12,12,9),(18,NULL,'9999-12-31 23:59:59.000000','2023-01-03 22:59:05.000000',14,14,10),(19,NULL,'9999-12-31 23:59:59.000000','2023-01-03 22:59:05.000000',14,14,11),(20,NULL,'2023-02-23 23:59:59.000000','2023-01-13 22:59:05.000000',16,16,12),(21,NULL,'2023-02-23 23:59:59.000000','2023-01-13 22:59:05.000000',18,18,13),(22,NULL,'2023-02-23 23:59:59.000000','2023-01-13 22:59:05.000000',18,18,14),(23,NULL,'2023-02-25 23:59:59.000000','2023-01-15 22:59:05.000000',4,4,15),(24,NULL,'2023-02-25 23:59:59.000000','2023-01-15 22:59:05.000000',4,4,16),(25,NULL,'2023-02-25 23:59:59.000000','2023-01-15 22:59:05.000000',4,4,17),(26,NULL,'2023-07-15 23:59:59.000000','2023-01-15 22:59:05.000000',9,9,21);
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'2024-12-31 00:00:00.000000',NULL,'banuser1@student.42seoul.kr','banuser1','USER'),(2,'2024-12-31 00:00:00.000000',NULL,'banuser2@student.42seoul.kr','banuser2','USER'),(3,'2024-12-31 00:00:00.000000',NULL,'penaltyuser1@student.42seoul.kr','penaltyuser1','USER'),(4,'2024-12-31 00:00:00.000000',NULL,'penaltyuser2@student.42seoul.kr','penaltyuser2','USER'),(5,'2024-12-31 00:00:00.000000',NULL,'lentuser1@student.42seoul.kr','lentuser1','USER'),(6,'2024-12-31 00:00:00.000000',NULL,'lentuser2@student.42seoul.kr','lentuser2','USER'),(7,'2024-12-31 00:00:00.000000',NULL,'koreauser@student.42seoul.kr','koreauser','USER'),(8,'2024-12-31 00:00:00.000000',NULL,'foreignuser@student.42.fr','foreignuser','USER'),(9,'2024-12-31 00:00:00.000000',NULL,'user1@student.42seoul.kr','user1','USER'),(10,'2024-12-31 00:00:00.000000',NULL,'user2@student.42seoul.kr','user2','USER'),(11,'2024-12-31 00:00:00.000000',NULL,'user3@student.42seoul.kr','user3','USER'),(12,'2024-12-31 00:00:00.000000',NULL,'user4@student.42seoul.kr','user4','USER'),(13,'2024-12-31 00:00:00.000000',NULL,'user5@student.42seoul.kr','user5','USER'),(14,'2024-12-31 00:00:00.000000',NULL,'user6@student.42seoul.kr','user6','USER'),(15,'2024-12-31 00:00:00.000000',NULL,'user7@student.42seoul.kr','user7','USER'),(16,'2024-12-31 00:00:00.000000',NULL,'user8@student.42seoul.kr','user8','USER'),(17,'2024-12-31 00:00:00.000000',NULL,'user9@student.42seoul.kr','user9','USER'),(18,'2024-12-31 00:00:00.000000',NULL,'user10@student.42seoul.kr','user10','USER'),(21,'2024-12-31 00:00:00.000000',NULL,'club1','club1','CLUB'),(22,'2024-12-31 00:00:00.000000',NULL,'club2','club2','CLUB');
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

-- Dump completed on 2023-04-29  2:16:14
