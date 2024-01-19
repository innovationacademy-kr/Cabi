-- MySQL dump 10.13  Distrib 8.0.33, for macos13.3 (arm64)
--
-- Host: 127.0.0.1    Database: cabi_local
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.39-MariaDB-0+deb10u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

--
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
create table admin
(
    id    bigint auto_increment
        primary key,
    email varchar(128) not null,
    role  varchar(16)  not null,
    constraint UK_6etwowal6qxvr7xuvqcqmnnk7
        unique (email)
)ENGINE = InnoDB
  AUTO_INCREMENT = 6
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

LOCK TABLES `admin` WRITE;
INSERT INTO `admin`
VALUES (1, 'admin0@gmail.com', 'NONE'),
       (2, 'admin1@gmail.com', 'ADMIN'),
       (3, 'admin2@gmail.com', 'MASTER'),
       (4, 'innoaca@cabi.42seoul.io', 'MASTER');
UNLOCK TABLES;

DROP TABLE IF EXISTS `ban_history`;

create table ban_history
(
    id          bigint auto_increment
        primary key,
    ban_type    varchar(32) not null,
    banned_at   datetime(6) not null,
    unbanned_at datetime(6) null,
    user_id     bigint      not null,
    constraint FK6hig35mfe4ski2gmrsesnicu2
        foreign key (user_id) references user (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `ban_history`
--

LOCK TABLES `ban_history` WRITE;
/*!40000 ALTER TABLE `ban_history`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `ban_history`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabinet`
--

DROP TABLE IF EXISTS `cabinet`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
create table cabinet
(
    id               bigint auto_increment
        primary key,
    col              int         null,
    row              int         null,
    lent_type        varchar(16) not null,
    max_user         int         not null,
    status           varchar(32) not null,
    status_note      varchar(64) null,
    visible_num      int         null,
    cabinet_place_id bigint      null,
    title            varchar(64) null,
    memo             varchar(64) null,
    constraint FKip05uw7xaywjxlu4ljswturit
        foreign key (cabinet_place_id) references cabinet_place (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 399
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

LOCK TABLES `cabinet` WRITE;

INSERT INTO `cabinet`
VALUES (1, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 89, 5, '', ''),
       (2, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 90, 5, '', ''),
       (3, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 91, 5, '', ''),
       (4, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 92, 5, '', ''),
       (5, 4, 0, 'SHARE', 3, 'AVAILABLE', '', 93, 5, '', ''),
       (6, 5, 0, 'SHARE', 3, 'AVAILABLE', '', 94, 5, '', ''),
       (7, 6, 0, 'SHARE', 3, 'AVAILABLE', '', 95, 5, '', ''),
       (8, 7, 0, 'SHARE', 3, 'AVAILABLE', '', 96, 5, '', ''),
       (9, 8, 0, 'SHARE', 3, 'AVAILABLE', '', 97, 5, '', ''),
       (10, 9, 0, 'SHARE', 3, 'AVAILABLE', '', 98, 5, '', ''),
       (11, 10, 0, 'SHARE', 3, 'AVAILABLE', '', 99, 5, '', ''),
       (12, 11, 0, 'SHARE', 3, 'AVAILABLE', '', 100, 5, '', ''),
       (13, 12, 0, 'SHARE', 3, 'AVAILABLE', '', 101, 5, '', ''),
       (14, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 102, 5, '', ''),
       (15, 1, 1, 'SHARE', 3, 'AVAILABLE', '', 103, 5, '', ''),
       (16, 2, 1, 'SHARE', 3, 'AVAILABLE', '', 104, 5, '', ''),
       (17, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 105, 5, '', ''),
       (18, 4, 1, 'PRIVATE', 1, 'AVAILABLE', '', 106, 5, '', ''),
       (19, 5, 1, 'PRIVATE', 1, 'AVAILABLE', '', 107, 5, '', ''),
       (20, 6, 1, 'PRIVATE', 1, 'AVAILABLE', '', 108, 5, '', ''),
       (21, 7, 1, 'PRIVATE', 1, 'AVAILABLE', '', 109, 5, '', ''),
       (22, 8, 1, 'PRIVATE', 1, 'AVAILABLE', '', 110, 5, '', ''),
       (23, 9, 1, 'PRIVATE', 1, 'AVAILABLE', '', 111, 5, '', ''),
       (24, 10, 1, 'PRIVATE', 1, 'AVAILABLE', '', 112, 5, '', ''),
       (25, 11, 1, 'PRIVATE', 1, 'AVAILABLE', '', 113, 5, '', ''),
       (26, 12, 1, 'PRIVATE', 1, 'AVAILABLE', '', 114, 5, '', ''),
       (27, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 115, 5, '', ''),
       (28, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 116, 5, '', ''),
       (29, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 117, 5, '', ''),
       (30, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 118, 5, '', ''),
       (31, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 119, 5, '', ''),
       (32, 5, 2, 'PRIVATE', 1, 'AVAILABLE', '', 120, 5, '', ''),
       (33, 6, 2, 'PRIVATE', 1, 'AVAILABLE', '', 121, 5, '', ''),
       (34, 7, 2, 'PRIVATE', 1, 'AVAILABLE', '', 122, 5, '', ''),
       (35, 8, 2, 'PRIVATE', 1, 'AVAILABLE', '', 123, 5, '', ''),
       (36, 9, 2, 'PRIVATE', 1, 'AVAILABLE', '', 124, 5, '', ''),
       (37, 10, 2, 'PRIVATE', 1, 'AVAILABLE', '', 125, 5, '', ''),
       (38, 11, 2, 'PRIVATE', 1, 'AVAILABLE', '', 126, 5, '', ''),
       (39, 12, 2, 'PRIVATE', 1, 'AVAILABLE', '', 127, 5, '', ''),
       (40, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 128, 5, '', ''),
       (41, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 129, 5, '', ''),
       (42, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 130, 5, '', ''),
       (43, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 131, 5, '', ''),
       (44, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 132, 5, '', ''),
       (45, 5, 3, 'PRIVATE', 1, 'AVAILABLE', '', 133, 5, '', ''),
       (46, 6, 3, 'PRIVATE', 1, 'AVAILABLE', '', 134, 5, '', ''),
       (47, 7, 3, 'PRIVATE', 1, 'AVAILABLE', '', 135, 5, '', ''),
       (48, 8, 3, 'PRIVATE', 1, 'AVAILABLE', '', 136, 5, '', ''),
       (49, 9, 3, 'PRIVATE', 1, 'AVAILABLE', '', 137, 5, '', ''),
       (50, 10, 3, 'PRIVATE', 1, 'AVAILABLE', '', 138, 5, '', ''),
       (51, 11, 3, 'PRIVATE', 1, 'AVAILABLE', '', 139, 5, '', ''),
       (52, 12, 3, 'PRIVATE', 1, 'AVAILABLE', '', 140, 5, '', ''),
       (53, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 141, 6, '', ''),
       (54, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 142, 6, '', ''),
       (55, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 143, 6, '', ''),
       (56, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 144, 6, '', ''),
       (57, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 145, 6, '', ''),
       (58, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 146, 6, '', ''),
       (59, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 147, 6, '', ''),
       (60, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 148, 6, '', ''),
       (61, 0, 0, 'PRIVATE', 1, 'AVAILABLE', '', 17, 2, '', ''),
       (62, 1, 0, 'PRIVATE', 1, 'AVAILABLE', '', 18, 2, '', ''),
       (63, 2, 0, 'PRIVATE', 1, 'AVAILABLE', '', 19, 2, '', ''),
       (64, 3, 0, 'PRIVATE', 1, 'AVAILABLE', '', 20, 2, '', ''),
       (65, 4, 0, 'PRIVATE', 1, 'AVAILABLE', '', 21, 2, '', ''),
       (66, 0, 1, 'PRIVATE', 1, 'AVAILABLE', '', 22, 2, '', ''),
       (67, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 23, 2, '', ''),
       (68, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 24, 2, '', ''),
       (69, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 25, 2, '', ''),
       (70, 4, 1, 'PRIVATE', 1, 'AVAILABLE', '', 26, 2, '', ''),
       (71, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 27, 2, '', ''),
       (72, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 28, 2, '', ''),
       (73, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 29, 2, '', ''),
       (74, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 30, 2, '', ''),
       (75, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 31, 2, '', ''),
       (76, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 32, 2, '', ''),
       (77, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 33, 2, '', ''),
       (78, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 34, 2, '', ''),
       (79, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 35, 2, '', ''),
       (80, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 36, 2, '', ''),
       (81, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 1, 1, '', ''),
       (82, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 2, 1, '', ''),
       (83, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 3, 1, '', ''),
       (84, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 4, 1, '', ''),
       (85, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 5, 1, '', ''),
       (86, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 6, 1, '', ''),
       (87, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 7, 1, '', ''),
       (88, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 8, 1, '', ''),
       (89, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 9, 1, '', ''),
       (90, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 10, 1, '', ''),
       (91, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 11, 1, '', ''),
       (92, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 12, 1, '', ''),
       (93, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 13, 1, '', ''),
       (94, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 14, 1, '', ''),
       (95, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 15, 1, '', ''),
       (96, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 16, 1, '', ''),
       (97, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 37, 3, '', ''),
       (98, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 38, 3, '', ''),
       (99, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 39, 3, '', ''),
       (100, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 40, 3, '', ''),
       (101, 4, 0, 'SHARE', 3, 'AVAILABLE', '', 41, 3, '', ''),
       (102, 5, 0, 'SHARE', 3, 'AVAILABLE', '', 42, 3, '', ''),
       (103, 6, 0, 'SHARE', 3, 'AVAILABLE', '', 43, 3, '', ''),
       (104, 7, 0, 'SHARE', 3, 'AVAILABLE', '', 44, 3, '', ''),
       (105, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 45, 3, '', ''),
       (106, 1, 1, 'SHARE', 3, 'AVAILABLE', '', 46, 3, '', ''),
       (107, 2, 1, 'SHARE', 3, 'AVAILABLE', '', 47, 3, '', ''),
       (108, 3, 1, 'SHARE', 3, 'AVAILABLE', '', 48, 3, '', ''),
       (109, 4, 1, 'SHARE', 3, 'AVAILABLE', '', 49, 3, '', ''),
       (110, 5, 1, 'SHARE', 3, 'AVAILABLE', '', 50, 3, '', ''),
       (111, 6, 1, 'SHARE', 3, 'AVAILABLE', '', 51, 3, '', ''),
       (112, 7, 1, 'SHARE', 3, 'AVAILABLE', '', 52, 3, '', ''),
       (113, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 53, 3, '', ''),
       (114, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 54, 3, '', ''),
       (115, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 55, 3, '', ''),
       (116, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 56, 3, '', ''),
       (117, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 57, 3, '', ''),
       (118, 5, 2, 'PRIVATE', 1, 'AVAILABLE', '', 58, 3, '', ''),
       (119, 6, 2, 'PRIVATE', 1, 'AVAILABLE', '', 59, 3, '', ''),
       (120, 7, 2, 'PRIVATE', 1, 'AVAILABLE', '', 60, 3, '', ''),
       (121, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 61, 3, '', ''),
       (122, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 62, 3, '', ''),
       (123, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 63, 3, '', ''),
       (124, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 64, 3, '', ''),
       (125, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 65, 3, '', ''),
       (126, 5, 3, 'PRIVATE', 1, 'AVAILABLE', '', 66, 3, '', ''),
       (127, 6, 3, 'PRIVATE', 1, 'AVAILABLE', '', 67, 3, '', ''),
       (128, 7, 3, 'PRIVATE', 1, 'AVAILABLE', '', 68, 3, '', ''),
       (129, 0, 0, 'PRIVATE', 1, 'AVAILABLE', '', 69, 4, '', ''),
       (130, 1, 0, 'PRIVATE', 1, 'AVAILABLE', '', 70, 4, '', ''),
       (131, 2, 0, 'PRIVATE', 1, 'AVAILABLE', '', 71, 4, '', ''),
       (132, 3, 0, 'PRIVATE', 1, 'AVAILABLE', '', 72, 4, '', ''),
       (133, 4, 0, 'PRIVATE', 1, 'AVAILABLE', '', 73, 4, '', ''),
       (134, 0, 1, 'PRIVATE', 1, 'AVAILABLE', '', 74, 4, '', ''),
       (135, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 75, 4, '', ''),
       (136, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 76, 4, '', ''),
       (137, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 77, 4, '', ''),
       (138, 4, 1, 'PRIVATE', 1, 'AVAILABLE', '', 78, 4, '', ''),
       (139, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 79, 4, '', ''),
       (140, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 80, 4, '', ''),
       (141, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 81, 4, '', ''),
       (142, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 82, 4, '', ''),
       (143, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 83, 4, '', ''),
       (144, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 84, 4, '', ''),
       (145, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 85, 4, '', ''),
       (146, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 86, 4, '', ''),
       (147, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 87, 4, '', ''),
       (148, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 88, 4, '', ''),
       (149, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 37, 16, '', ''),
       (150, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 38, 16, '', ''),
       (151, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 39, 16, '', ''),
       (152, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 40, 16, '', ''),
       (153, 4, 0, 'SHARE', 3, 'AVAILABLE', '', 41, 16, '', ''),
       (154, 5, 0, 'SHARE', 3, 'AVAILABLE', '', 42, 16, '', ''),
       (155, 6, 0, 'SHARE', 3, 'AVAILABLE', '', 43, 16, '', ''),
       (156, 7, 0, 'SHARE', 3, 'AVAILABLE', '', 44, 16, '', ''),
       (157, 8, 0, 'SHARE', 3, 'AVAILABLE', '', 45, 16, '', ''),
       (158, 9, 0, 'SHARE', 3, 'AVAILABLE', '', 46, 16, '', ''),
       (159, 10, 0, 'SHARE', 3, 'AVAILABLE', '', 47, 16, '', ''),
       (160, 11, 0, 'SHARE', 3, 'AVAILABLE', '', 48, 16, '', ''),
       (161, 12, 0, 'SHARE', 3, 'AVAILABLE', '', 49, 16, '', ''),
       (162, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 50, 16, '', ''),
       (163, 1, 1, 'SHARE', 3, 'AVAILABLE', '', 51, 16, '', ''),
       (164, 2, 1, 'SHARE', 3, 'AVAILABLE', '', 52, 16, '', ''),
       (165, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 53, 16, '', ''),
       (166, 4, 1, 'PRIVATE', 1, 'AVAILABLE', '', 54, 16, '', ''),
       (167, 5, 1, 'PRIVATE', 1, 'AVAILABLE', '', 55, 16, '', ''),
       (168, 6, 1, 'PRIVATE', 1, 'AVAILABLE', '', 56, 16, '', ''),
       (169, 7, 1, 'PRIVATE', 1, 'AVAILABLE', '', 57, 16, '', ''),
       (170, 8, 1, 'PRIVATE', 1, 'AVAILABLE', '', 58, 16, '', ''),
       (171, 9, 1, 'PRIVATE', 1, 'AVAILABLE', '', 59, 16, '', ''),
       (172, 10, 1, 'PRIVATE', 1, 'AVAILABLE', '', 60, 16, '', ''),
       (173, 11, 1, 'PRIVATE', 1, 'AVAILABLE', '', 61, 16, '', ''),
       (174, 12, 1, 'PRIVATE', 1, 'AVAILABLE', '', 62, 16, '', ''),
       (175, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 63, 16, '', ''),
       (176, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 64, 16, '', ''),
       (177, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 65, 16, '', ''),
       (178, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 66, 16, '', ''),
       (179, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 67, 16, '', ''),
       (180, 5, 2, 'PRIVATE', 1, 'AVAILABLE', '', 68, 16, '', ''),
       (181, 6, 2, 'PRIVATE', 1, 'AVAILABLE', '', 69, 16, '', ''),
       (182, 7, 2, 'PRIVATE', 1, 'AVAILABLE', '', 70, 16, '', ''),
       (183, 8, 2, 'PRIVATE', 1, 'AVAILABLE', '', 71, 16, '', ''),
       (184, 9, 2, 'PRIVATE', 1, 'AVAILABLE', '', 72, 16, '', ''),
       (185, 10, 2, 'PRIVATE', 1, 'AVAILABLE', '', 73, 16, '', ''),
       (186, 11, 2, 'PRIVATE', 1, 'AVAILABLE', '', 74, 16, '', ''),
       (187, 12, 2, 'PRIVATE', 1, 'AVAILABLE', '', 75, 16, '', ''),
       (188, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 76, 16, '', ''),
       (189, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 77, 16, '', ''),
       (190, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 78, 16, '', ''),
       (191, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 79, 16, '', ''),
       (192, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 80, 16, '', ''),
       (193, 5, 3, 'PRIVATE', 1, 'AVAILABLE', '', 81, 16, '', ''),
       (194, 6, 3, 'PRIVATE', 1, 'AVAILABLE', '', 82, 16, '', ''),
       (195, 7, 3, 'PRIVATE', 1, 'AVAILABLE', '', 83, 16, '', ''),
       (196, 8, 3, 'PRIVATE', 1, 'AVAILABLE', '', 84, 16, '', ''),
       (197, 9, 3, 'PRIVATE', 1, 'AVAILABLE', '', 85, 16, '', ''),
       (198, 10, 3, 'PRIVATE', 1, 'AVAILABLE', '', 86, 16, '', ''),
       (199, 11, 3, 'PRIVATE', 1, 'AVAILABLE', '', 87, 16, '', ''),
       (200, 12, 3, 'PRIVATE', 1, 'AVAILABLE', '', 88, 16, '', ''),
       (201, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 89, 17, '', ''),
       (202, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 90, 17, '', ''),
       (203, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 91, 17, '', ''),
       (204, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 92, 17, '', ''),
       (205, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 93, 17, '', ''),
       (206, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 94, 17, '', ''),
       (207, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 95, 17, '', ''),
       (208, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 96, 17, '', ''),
       (209, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 97, 17, '', ''),
       (210, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 98, 17, '', ''),
       (211, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 99, 17, '', ''),
       (212, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 100, 17, '', ''),
       (213, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 17, 15, '', ''),
       (214, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 18, 15, '', ''),
       (215, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 19, 15, '', ''),
       (216, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 20, 15, '', ''),
       (217, 4, 0, 'SHARE', 3, 'AVAILABLE', '', 21, 15, '', ''),
       (218, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 22, 15, '', ''),
       (219, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 23, 15, '', ''),
       (220, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 24, 15, '', ''),
       (221, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 25, 15, '', ''),
       (222, 4, 1, 'PRIVATE', 1, 'AVAILABLE', '', 26, 15, '', ''),
       (223, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 27, 15, '', ''),
       (224, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 28, 15, '', ''),
       (225, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 29, 15, '', ''),
       (226, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 30, 15, '', ''),
       (227, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 31, 15, '', ''),
       (228, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 32, 15, '', ''),
       (229, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 33, 15, '', ''),
       (230, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 34, 15, '', ''),
       (231, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 35, 15, '', ''),
       (232, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 36, 15, '', ''),
       (233, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 1, 14, '', ''),
       (234, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 2, 14, '', ''),
       (235, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 3, 14, '', ''),
       (236, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 4, 14, '', ''),
       (237, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 5, 14, '', ''),
       (238, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 6, 14, '', ''),
       (239, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 7, 14, '', ''),
       (240, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 8, 14, '', ''),
       (241, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 9, 14, '', ''),
       (242, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 10, 14, '', ''),
       (243, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 11, 14, '', ''),
       (244, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 12, 14, '', ''),
       (245, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 13, 14, '', ''),
       (246, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 14, 14, '', ''),
       (247, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 15, 14, '', ''),
       (248, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 16, 14, '', ''),
       (249, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 37, 20, '', ''),
       (250, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 38, 20, '', ''),
       (251, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 39, 20, '', ''),
       (252, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 40, 20, '', ''),
       (253, 4, 0, 'SHARE', 3, 'AVAILABLE', '', 41, 20, '', ''),
       (254, 5, 0, 'SHARE', 3, 'AVAILABLE', '', 42, 20, '', ''),
       (255, 6, 0, 'SHARE', 3, 'AVAILABLE', '', 43, 20, '', ''),
       (256, 7, 0, 'SHARE', 3, 'AVAILABLE', '', 44, 20, '', ''),
       (257, 8, 0, 'SHARE', 3, 'AVAILABLE', '', 45, 20, '', ''),
       (258, 9, 0, 'SHARE', 3, 'AVAILABLE', '', 46, 20, '', ''),
       (259, 10, 0, 'SHARE', 3, 'AVAILABLE', '', 47, 20, '', ''),
       (260, 11, 0, 'SHARE', 3, 'AVAILABLE', '', 48, 20, '', ''),
       (261, 12, 0, 'SHARE', 3, 'AVAILABLE', '', 49, 20, '', ''),
       (262, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 50, 20, '', ''),
       (263, 1, 1, 'SHARE', 3, 'AVAILABLE', '', 51, 20, '', ''),
       (264, 2, 1, 'SHARE', 3, 'AVAILABLE', '', 52, 20, '', ''),
       (265, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 53, 20, '', ''),
       (266, 4, 1, 'PRIVATE', 1, 'AVAILABLE', '', 54, 20, '', ''),
       (267, 5, 1, 'PRIVATE', 1, 'AVAILABLE', '', 55, 20, '', ''),
       (268, 6, 1, 'PRIVATE', 1, 'AVAILABLE', '', 56, 20, '', ''),
       (269, 7, 1, 'PRIVATE', 1, 'AVAILABLE', '', 57, 20, '', ''),
       (270, 8, 1, 'PRIVATE', 1, 'AVAILABLE', '', 58, 20, '', ''),
       (271, 9, 1, 'PRIVATE', 1, 'AVAILABLE', '', 59, 20, '', ''),
       (272, 10, 1, 'PRIVATE', 1, 'AVAILABLE', '', 60, 20, '', ''),
       (273, 11, 1, 'PRIVATE', 1, 'AVAILABLE', '', 61, 20, '', ''),
       (274, 12, 1, 'PRIVATE', 1, 'AVAILABLE', '', 62, 20, '', ''),
       (275, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 63, 20, '', ''),
       (276, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 64, 20, '', ''),
       (277, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 65, 20, '', ''),
       (278, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 66, 20, '', ''),
       (279, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 67, 20, '', ''),
       (280, 5, 2, 'PRIVATE', 1, 'AVAILABLE', '', 68, 20, '', ''),
       (281, 6, 2, 'PRIVATE', 1, 'AVAILABLE', '', 69, 20, '', ''),
       (282, 7, 2, 'PRIVATE', 1, 'AVAILABLE', '', 70, 20, '', ''),
       (283, 8, 2, 'PRIVATE', 1, 'AVAILABLE', '', 71, 20, '', ''),
       (284, 9, 2, 'PRIVATE', 1, 'AVAILABLE', '', 72, 20, '', ''),
       (285, 10, 2, 'PRIVATE', 1, 'AVAILABLE', '', 73, 20, '', ''),
       (286, 11, 2, 'PRIVATE', 1, 'AVAILABLE', '', 74, 20, '', ''),
       (287, 12, 2, 'PRIVATE', 1, 'AVAILABLE', '', 75, 20, '', ''),
       (288, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 76, 20, '', ''),
       (289, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 77, 20, '', ''),
       (290, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 78, 20, '', ''),
       (291, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 79, 20, '', ''),
       (292, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 80, 20, '', ''),
       (293, 5, 3, 'PRIVATE', 1, 'AVAILABLE', '', 81, 20, '', ''),
       (294, 6, 3, 'PRIVATE', 1, 'AVAILABLE', '', 82, 20, '', ''),
       (295, 7, 3, 'PRIVATE', 1, 'AVAILABLE', '', 83, 20, '', ''),
       (296, 8, 3, 'PRIVATE', 1, 'AVAILABLE', '', 84, 20, '', ''),
       (297, 9, 3, 'PRIVATE', 1, 'AVAILABLE', '', 85, 20, '', ''),
       (298, 10, 3, 'PRIVATE', 1, 'AVAILABLE', '', 86, 20, '', ''),
       (299, 11, 3, 'PRIVATE', 1, 'AVAILABLE', '', 87, 20, '', ''),
       (300, 12, 3, 'PRIVATE', 1, 'AVAILABLE', '', 88, 20, '', ''),
       (301, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 17, 19, '', ''),
       (302, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 18, 19, '', ''),
       (303, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 19, 19, '', ''),
       (304, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 20, 19, '', ''),
       (305, 4, 0, 'SHARE', 3, 'AVAILABLE', '', 21, 19, '', ''),
       (306, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 22, 19, '', ''),
       (307, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 23, 19, '', ''),
       (308, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 24, 19, '', ''),
       (309, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 25, 19, '', ''),
       (310, 4, 1, 'PRIVATE', 1, 'AVAILABLE', '', 26, 19, '', ''),
       (311, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 27, 19, '', ''),
       (312, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 28, 19, '', ''),
       (313, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 29, 19, '', ''),
       (314, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 30, 19, '', ''),
       (315, 4, 2, 'PRIVATE', 1, 'AVAILABLE', '', 31, 19, '', ''),
       (316, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 32, 19, '', ''),
       (317, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 33, 19, '', ''),
       (318, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 34, 19, '', ''),
       (319, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 35, 19, '', ''),
       (320, 4, 3, 'PRIVATE', 1, 'AVAILABLE', '', 36, 19, '', ''),
       (321, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 1, 18, '', ''),
       (322, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 2, 18, '', ''),
       (323, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 3, 18, '', ''),
       (324, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 4, 18, '', ''),
       (325, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 5, 18, '', ''),
       (326, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 6, 18, '', ''),
       (327, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 7, 18, '', ''),
       (328, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 8, 18, '', ''),
       (329, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 9, 18, '', ''),
       (330, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 10, 18, '', ''),
       (331, 2, 2, 'PRIVATE', 1, 'AVAILABLE', '', 11, 18, '', ''),
       (332, 3, 2, 'PRIVATE', 1, 'AVAILABLE', '', 12, 18, '', ''),
       (333, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 13, 18, '', ''),
       (334, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 14, 18, '', ''),
       (335, 2, 3, 'PRIVATE', 1, 'AVAILABLE', '', 15, 18, '', ''),
       (336, 3, 3, 'PRIVATE', 1, 'AVAILABLE', '', 16, 18, '', ''),
       (337, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 89, 21, '', ''),
       (338, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 90, 21, '', ''),
       (339, 0, 1, 'SHARE', 3, 'AVAILABLE', '', 91, 21, '', ''),
       (340, 1, 1, 'SHARE', 3, 'AVAILABLE', '', 92, 21, '', ''),
       (341, 0, 2, 'PRIVATE', 1, 'AVAILABLE', '', 93, 21, '', ''),
       (342, 1, 2, 'PRIVATE', 1, 'AVAILABLE', '', 94, 21, '', ''),
       (343, 0, 3, 'PRIVATE', 1, 'AVAILABLE', '', 95, 21, '', ''),
       (344, 1, 3, 'PRIVATE', 1, 'AVAILABLE', '', 96, 21, '', ''),
       (345, 0, 0, 'CLUB', 1, 'AVAILABLE', '', 1, 7, '', ''),
       (346, 1, 0, 'CLUB', 1, 'AVAILABLE', '', 2, 7, '', ''),
       (347, 2, 0, 'CLUB', 1, 'AVAILABLE', '', 3, 7, '', ''),
       (348, 3, 0, 'CLUB', 1, 'AVAILABLE', '', 4, 7, '', ''),
       (349, 0, 1, 'CLUB', 1, 'AVAILABLE', '', 5, 7, '', ''),
       (350, 1, 1, 'CLUB', 1, 'AVAILABLE', '', 6, 7, '', ''),
       (351, 2, 1, 'CLUB', 1, 'AVAILABLE', '', 7, 7, '', ''),
       (352, 3, 1, 'CLUB', 1, 'AVAILABLE', '', 8, 7, '', ''),
       (353, 0, 0, 'CLUB', 1, 'AVAILABLE', '', 9, 8, '', ''),
       (354, 1, 0, 'CLUB', 1, 'AVAILABLE', '', 10, 8, '', ''),
       (355, 2, 0, 'CLUB', 1, 'AVAILABLE', '', 11, 8, '', ''),
       (356, 3, 0, 'CLUB', 1, 'AVAILABLE', '', 12, 8, '', ''),
       (357, 0, 1, 'CLUB', 1, 'AVAILABLE', '', 13, 8, '', ''),
       (358, 1, 1, 'CLUB', 1, 'AVAILABLE', '', 14, 8, '', ''),
       (359, 2, 1, 'CLUB', 1, 'AVAILABLE', '', 15, 8, '', ''),
       (360, 3, 1, 'CLUB', 1, 'AVAILABLE', '', 16, 8, '', ''),
       (361, 0, 0, 'CLUB', 1, 'AVAILABLE', '', 17, 9, '', ''),
       (362, 1, 0, 'CLUB', 1, 'AVAILABLE', '', 18, 9, '', ''),
       (363, 2, 0, 'CLUB', 1, 'AVAILABLE', '', 19, 9, '', ''),
       (364, 3, 0, 'CLUB', 1, 'AVAILABLE', '', 20, 9, '', ''),
       (365, 0, 1, 'CLUB', 1, 'AVAILABLE', '', 21, 9, '', ''),
       (366, 1, 1, 'CLUB', 1, 'AVAILABLE', '', 22, 9, '', ''),
       (367, 2, 1, 'CLUB', 1, 'AVAILABLE', '', 23, 9, '', ''),
       (368, 3, 1, 'CLUB', 1, 'AVAILABLE', '', 24, 9, '', ''),
       (369, 0, 0, 'CLUB', 1, 'AVAILABLE', '', 25, 10, '', ''),
       (370, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 26, 10, '', ''),
       (371, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 27, 10, '', ''),
       (372, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 28, 10, '', ''),
       (373, 0, 1, 'CLUB', 1, 'AVAILABLE', '', 29, 10, '', ''),
       (374, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 30, 10, '', ''),
       (375, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 31, 10, '', ''),
       (376, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 32, 10, '', ''),
       (377, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 33, 11, '', ''),
       (378, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 34, 11, '', ''),
       (379, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 35, 11, '', ''),
       (380, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 36, 11, '', ''),
       (381, 0, 1, 'PRIVATE', 1, 'AVAILABLE', '', 37, 11, '', ''),
       (382, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 38, 11, '', ''),
       (383, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 39, 11, '', ''),
       (384, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 40, 11, '', ''),
       (385, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 41, 12, '', ''),
       (386, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 42, 12, '', ''),
       (387, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 43, 12, '', ''),
       (388, 3, 0, 'SHARE', 3, 'AVAILABLE', '', 44, 12, '', ''),
       (389, 0, 1, 'PRIVATE', 1, 'AVAILABLE', '', 45, 12, '', ''),
       (390, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 46, 12, '', ''),
       (391, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 47, 12, '', ''),
       (392, 3, 1, 'PRIVATE', 1, 'AVAILABLE', '', 48, 12, '', ''),
       (393, 0, 0, 'SHARE', 3, 'AVAILABLE', '', 49, 13, '', ''),
       (394, 1, 0, 'SHARE', 3, 'AVAILABLE', '', 50, 13, '', ''),
       (395, 2, 0, 'SHARE', 3, 'AVAILABLE', '', 51, 13, '', ''),
       (396, 0, 1, 'PRIVATE', 1, 'AVAILABLE', '', 52, 13, '', ''),
       (397, 1, 1, 'PRIVATE', 1, 'AVAILABLE', '', 53, 13, '', ''),
       (398, 2, 1, 'PRIVATE', 1, 'AVAILABLE', '', 54, 13, '', '');
UNLOCK TABLES;

--
-- Table structure for table `cabinet_place`
--

DROP TABLE IF EXISTS `cabinet_place`;
create table cabinet_place
(
    id       bigint auto_increment
        primary key,
    height   int          null,
    width    int          null,
    building varchar(255) null,
    floor    int          null,
    section  varchar(255) null,
    end_x    int          null,
    end_y    int          null,
    start_x  int          null,
    start_y  int          null
) ENGINE = InnoDB
  AUTO_INCREMENT = 22
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `cabinet_place`
--

LOCK TABLES `cabinet_place` WRITE;
/*!40000 ALTER TABLE `cabinet_place`
    DISABLE KEYS */;
INSERT INTO `cabinet_place`
VALUES (1, 4, 4, '새롬관', 2, 'End of Cluster 1', 0, 0, 0, 0),
       (2, 4, 5, '새롬관', 2, 'Cluster 1 - OA', 0, 0, 0, 0),
       (3, 4, 8, '새롬관', 2, 'Cluster 1 - Terrace1', 0, 0, 0, 0),
       (4, 4, 5, '새롬관', 2, 'Cluster 1 - Terrace2', 0, 0, 0, 0),
       (5, 4, 13, '새롬관', 2, 'Oasis', 0, 0, 0, 0),
       (6, 4, 2, '새롬관', 2, 'End of Cluster 2', 0, 0, 0, 0),
       (7, 2, 4, '새롬관', 3, 'Cluster X - 1', 0, 0, 0, 0),
       (8, 2, 4, '새롬관', 3, 'Cluster X - 2', 0, 0, 0, 0),
       (9, 2, 4, '새롬관', 3, 'Cluster X - 3', 0, 0, 0, 0),
       (10, 2, 4, '새롬관', 3, 'Cluster X - 4', 0, 0, 0, 0),
       (11, 2, 4, '새롬관', 3, 'Cluster X - 5', 0, 0, 0, 0),
       (12, 2, 4, '새롬관', 3, 'Cluster X - 6', 0, 0, 0, 0),
       (13, 2, 3, '새롬관', 3, 'Cluster X - 7', 0, 0, 0, 0),
       (14, 4, 4, '새롬관', 4, 'End of Cluster 3', 0, 0, 0, 0),
       (15, 4, 5, '새롬관', 4, 'Cluster 3 - OA', 0, 0, 0, 0),
       (16, 4, 13, '새롬관', 4, 'Oasis', 0, 0, 0, 0),
       (17, 4, 3, '새롬관', 4, 'End of Cluster 4', 0, 0, 0, 0),
       (18, 4, 4, '새롬관', 5, 'End of Cluster 5', 0, 0, 0, 0),
       (19, 4, 5, '새롬관', 5, 'Cluster 5 - OA', 0, 0, 0, 0),
       (20, 4, 13, '새롬관', 5, 'Oasis', 0, 0, 0, 0),
       (21, 4, 2, '새롬관', 5, 'End of Cluster 6', 0, 0, 0, 0);
/*!40000 ALTER TABLE `cabinet_place`
    ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;

create table user
(
    id            bigint auto_increment
        primary key,
    blackholed_at datetime(6)  null,
    deleted_at    datetime(6)  null,
    email         varchar(255) null,
    name          varchar(32)  not null,
    role          varchar(32)  not null,
    slack_alarm boolean default true null,
    email_alarm boolean default true null,
    push_alarm boolean default false null,

        constraint UK_gj2fy3dcix7ph7k8684gka40c
        unique (name),
    constraint UK_ob8kqyqqgmefl0aco34akdtpe
        unique (email)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `user`
    ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `lent_history`
--

DROP TABLE IF EXISTS `lent_history`;
create table lent_history
(
    id         bigint auto_increment
        primary key,
    cabinet_id bigint      not null,
    ended_at   datetime(6) null,
    expired_at datetime(6) null,
    started_at datetime(6) not null,
    user_id    bigint      not null,
    constraint FK1xkpq0vetx7k0g7x02lpc1yxf
        foreign key (cabinet_id) references cabinet (id),
    constraint FK379daj8r09scml2fagnjnablm
        foreign key (user_id) references user (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `lent_history`
--

LOCK TABLES `lent_history` WRITE;
/*!40000 ALTER TABLE `lent_history`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `lent_history`
    ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `lent_extension`;

create table lent_extension
(
    id               bigint auto_increment
        primary key,
    user_id          bigint       not null,
    name             varchar(255) not null,
    extension_period int          not null,
    type             varchar(255) not null,
    expired_at       datetime(6)  not null,
    used_at          datetime(6)  null,
    constraint FKc63p20x0ypp1j99gougq63mq7
        foreign key (user_id) references user (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

/*!40103 SET TIME_ZONE = @OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;

-- Dump completed on 2023-06-18 22:56:47
