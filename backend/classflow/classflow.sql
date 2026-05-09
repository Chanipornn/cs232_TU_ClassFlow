-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: classflow_db
-- ------------------------------------------------------
-- Server version	8.4.9

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
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_code` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `instructor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt9ppvygxrm6wn5h58nbmft7xi` (`instructor_id`),
  CONSTRAINT `FKt9ppvygxrm6wn5h58nbmft7xi` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_files`
--

DROP TABLE IF EXISTS `assignment_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_assignment_file` (`assignment_id`),
  CONSTRAINT `fk_assignment_file` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_files`
--

LOCK TABLES `assignment_files` WRITE;
/*!40000 ALTER TABLE `assignment_files` DISABLE KEYS */;
INSERT INTO `assignment_files` VALUES (6,'สรุป-RequirementสำหรับสอนCS264-2566-reviewedBySongsakdi.pdf',13),(11,'Test_Plan_OnlinePetitionSystem_with_TestCases-lab8พ.ค..docx',16),(12,'Thammasat University Students’ Web Application Usage Behavior (1).pdf',1);
/*!40000 ALTER TABLE `assignment_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deadline` datetime(6) DEFAULT NULL,
  `description` text,
  `title` varchar(255) DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  `attachment_file_name` varchar(255) DEFAULT NULL,
  `requirements` text,
  `due_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6p1m72jobsvmrrn4bpj4168mg` (`course_id`),
  CONSTRAINT `FK6p1m72jobsvmrrn4bpj4168mg` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,'2026-05-12 19:54:00.000000','ออกแบบระบบ Cloud Architecture สำหรับระบบ Web Application โดยใช้บริการของ AWS อย่างน้อย 3 บริการ เช่น EC2, S3, RDS, Lambda, API Gateway หรืออื่น ๆ\r\nนักศึกษาต้องอธิบายโครงสร้างระบบ (Architecture Diagram) พร้อมเหตุผลในการเลือกใช้แต่ละ service รวมถึงการออกแบบให้รองรับ scalability และ high availability','Cloud Architecture Design',8,NULL,'',NULL),(2,'2026-06-06 19:56:00.000000','พัฒนา application แบบ Serverless โดยใช้ AWS Lambda และบริการที่เกี่ยวข้อง เช่น API Gateway, DynamoDB หรือ S3\nระบบต้องสามารถรับ request จาก client และประมวลผลผ่าน Lambda โดยไม่ใช้ server แบบ traditional','Serverless Application',8,NULL,'',NULL),(13,'2026-05-04 15:58:00.000000','sdfguhiop/lkyjthref','test finally',8,NULL,NULL,NULL),(16,'2026-05-30 16:51:00.000000','ASRDTFYKUKJYHTGRF','test 13',8,NULL,'ESRDTFYGUI.JK,HGF',NULL);
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `instructor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcyfum8goa6q5u13uog0563gyp` (`instructor_id`),
  CONSTRAINT `FKcyfum8goa6q5u13uog0563gyp` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (6,'CS100','Basic concepts of web development, web architecture, HTML & CSS  fundamentals, development cycle with Git, JavaScript programming,  form & validation, responsive web components, web deployment.','Basic Web Development','650001',14),(7,'CS100','Basic concepts of web development, web architecture, HTML & CSS  fundamentals, development cycle with Git, JavaScript programming,  form & validation, responsive web components, web deployment.','Basic Web Development','650002',14),(8,'CS332/CS232','Have taken or Study with CS 222 or Have taken CS 233        Cloud computing concepts and characteristics, cloud computing  service models.','INTRODUCTION TO CLOUD COMPUTING TECHNOLOGY','65001',14),(9,'CS366','Have taken CS 232           Monolithic applications and microservices, serverless computing,  and decoupled architecture with message queues.','MICROSERVICES AND SERVERLESS ARCHITECTURES','650002',14),(10,NULL,'Commuication',NULL,'650001',14);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKho8mcicp4196ebpltdn9wl6co` (`course_id`),
  KEY `FK2lha5vwilci2yi3vu5akusx4a` (`student_id`),
  CONSTRAINT `FK2lha5vwilci2yi3vu5akusx4a` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKho8mcicp4196ebpltdn9wl6co` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,8,15),(2,8,16);
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_url` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `assignment_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `is_late` bit(1) DEFAULT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_code` varchar(255) DEFAULT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `grade` double DEFAULT NULL,
  `graded_by` varchar(255) DEFAULT NULL,
  `max_score` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrirbb44savy2g7nws0hoxs949` (`assignment_id`),
  KEY `FK3p6y8mnhpwusdgqrdl4hcl72m` (`student_id`),
  CONSTRAINT `FK3p6y8mnhpwusdgqrdl4hcl72m` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrirbb44savy2g7nws0hoxs949` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (4,'https://classflow-submissions.s3.us-east-1.amazonaws.com/submissions/284f2d9e-6a6a-4f4d-9249-9794adbec89d_68-2_XSS.pdf','SUBMITTED','2026-05-09 08:08:50.057258',1,NULL,'68-2_XSS.pdf',_binary '\0','แพรพลอย','6709650540','Awesome',95,'Instructor',100),(5,'https://classflow-submissions.s3.us-east-1.amazonaws.com/submissions/b8b0ab4b-22cf-4aaf-977a-2c62a4f99aaa_IEEE829_TestPlan.pdf','SUBMITTED','2026-05-09 08:29:17.036680',1,NULL,'IEEE829_TestPlan.pdf',_binary '\0','ชญาณ์นันท์ มะริวรรณ์','6709650219','Good',90,'Instructor',100);
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `cognito_sub` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cognito_sub` (`cognito_sub`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'chayananmariwan@gmail.com','INSTRUCTOR','f468a448-a081-7096-4cb9-7869752e088b'),(15,'chayanan.mari@dome.tu.ac.th','STUDENT','24288488-a0c1-7012-4f43-a957b112dd8f'),(16,'pairploy.pip@dome.tu.ac.th','STUDENT','b4c8d4c8-0031-7074-da09-26f63668670f');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09 18:18:01
