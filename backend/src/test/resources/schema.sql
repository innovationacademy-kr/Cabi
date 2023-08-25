-- MySQL dump 10.13  Distrib 8.0.32, for macos13.0 (arm64)
--
-- Host: 127.0.0.1    Database: cabi_local
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.38-MariaDB-0+deb10u1

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

-- DROP TABLE IF EXISTS `admin_user`;
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

/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;


--
-- Table structure for table `ban_history`
--

-- DROP TABLE IF EXISTS `ban_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ban_history` (
                               `ban_history_id` bigint(20) NOT NULL AUTO_INCREMENT,
                               `ban_type` varchar(32) NOT NULL,
                               `banned_at` datetime(6) NOT NULL,
                               `unbanned_at` datetime(6) DEFAULT NULL,
                               `user_id` bigint(20) NOT NULL,
                               PRIMARY KEY (`ban_history_id`),
                               KEY `FKn0s4q3cllg207pni4as71face` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ban_history`
--


/*!40000 ALTER TABLE `ban_history` DISABLE KEYS */;


--
-- Table structure for table `cabinet`
--

-- DROP TABLE IF EXISTS `cabinet`;
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
                           KEY `FKah76pjwfflx2q114ixtihoa3g` (`cabinet_place_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabinet`
--


/*!40000 ALTER TABLE `cabinet` DISABLE KEYS */;


--
-- Table structure for table `cabinet_place`
--

-- DROP TABLE IF EXISTS `cabinet_place`;
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


/*!40000 ALTER TABLE `cabinet_place` ENABLE KEYS */;


--
-- Table structure for table `lent_history`
--

-- DROP TABLE IF EXISTS `lent_history`;
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
                                KEY `FK65rj7u9eih0x63rpeyoq5gp2h` (`cabinet_id`),
                                KEY `FKp4gd80p8ruvkxqvxhqpy37wvu` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lent_history`
--


/*!40000 ALTER TABLE `lent_history` DISABLE KEYS */;


--
-- Table structure for table `user`
--

-- DROP TABLE IF EXISTS `user`;
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

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-08 15:12:21

ALTER TABLE `ban_history` ADD CONSTRAINT `ban_history_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
ALTER TABLE `cabinet` ADD CONSTRAINT `cabinet_cabinet_place` FOREIGN KEY (`cabinet_place_id`) REFERENCES `cabinet_place` (`cabinet_place_id`);
ALTER TABLE `lent_history` ADD CONSTRAINT `lent_history_cabinet` FOREIGN KEY (`cabinet_id`) REFERENCES `cabinet` (`cabinet_id`);
ALTER TABLE `lent_history` ADD CONSTRAINT `lent_history_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);