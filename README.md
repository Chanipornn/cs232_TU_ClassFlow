https://drive.google.com/file/d/1ZGrZYg4fP9XIiWisWjwsp1AT_PWjzNSK/view?usp=sharing# TU ClassFlow

TU ClassFlow คือระบบจัดการการเรียนการสอนบน Cloud
ที่ช่วยให้อาจารย์และนักศึกษาสามารถจัดการ Assignment
การส่งงาน การตรวจงาน และการแจ้งเตือนต่าง ๆ ได้ภายในระบบเดียว

ระบบถูกพัฒนาในรูปแบบ Web Application โดยเชื่อมต่อกับบริการต่าง ๆ บน AWS
เพื่อรองรับการจัดเก็บข้อมูล การจัดเก็บไฟล์ และระบบแจ้งเตือนแบบ Cloud-Based

---

# คุณสมบัติของระบบ

- ระบบเข้าสู่ระบบและยืนยันตัวตน
- ระบบจัดการรายวิชา
- ระบบสร้าง Assignment
- ระบบส่งงานออนไลน์
- ระบบ Upload / Download ไฟล์
- ระบบตรวจงานและให้คะแนน
- ระบบ Feedback สำหรับนักศึกษา
- ระบบแจ้งเตือน Deadline Assignment
- ระบบแสดงผลข้อมูลแบบ Dynamic

---

# เทคโนโลยีที่ใช้

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Spring Boot
- REST API
- JPA / Hibernate

## Database
- MySQL
- Amazon RDS

## AWS Services
- Amazon Cognito
- Amazon S3
- Amazon SNS
- Amazon EventBridge

---

# สถาปัตยกรรมของระบบ

Student / Instructor
↓
Frontend (HTML/CSS/JavaScript)
↓
Spring Boot REST API
↓
Amazon RDS + Amazon S3 + SNS + Cognito

---

# AWS Services ที่ใช้

| Service | หน้าที่ |
|---|---|
| Amazon Cognito | Authentication และ JWT |
| Amazon RDS | จัดเก็บข้อมูลระบบ |
| Amazon S3 | จัดเก็บไฟล์ Assignment |
| Amazon SNS | ส่ง Email Notification |
| Amazon EventBridge | Trigger ระบบแจ้งเตือน |

---

# ฟังก์ชันหลักของระบบ

## ฝั่งนักศึกษา

- Login / Logout
- Enroll รายวิชา
- ดู Assignment
- ส่ง Assignment
- Upload File
- ดูคะแนนและ Feedback
- รับ Notification

## ฝั่งอาจารย์

- สร้างรายวิชา
- สร้าง Assignment
- ดู Submission
- Download ไฟล์งาน
- ให้คะแนน
- ส่ง Feedback

---

# วิธีติดตั้งระบบ

## Backend

1. เปิดโปรเจกต์ Spring Boot
2. แก้ไข application.properties
3. Run Spring Boot

## Frontend

1. เปิดโฟลเดอร์ frontend
2. Run ผ่าน Live Server

---

# การเชื่อม Amazon RDS

ตัวอย่าง:

spring.datasource.url=jdbc:mysql://your-rds-endpoint:3306/classflow

---

# การเชื่อม Amazon S3

ระบบใช้ AWS SDK สำหรับ Upload ไฟล์ Assignment และ Submission

---

# Demo Video

https://drive.google.com/file/d/1ZGrZYg4fP9XIiWisWjwsp1AT_PWjzNSK/view?usp=sharing

---

# GitHub Repository

https://github.com/Chanipornn/cs232_TU_ClassFlow
