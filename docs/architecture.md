# สถาปัตยกรรมของระบบ

ระบบ TU ClassFlow ถูกพัฒนาในรูปแบบ Cloud-Based Architecture
เพื่อรองรับการจัดเก็บข้อมูล การจัดเก็บไฟล์ และการแจ้งเตือนแบบออนไลน์

---

# โครงสร้างการทำงานของระบบ

Student / Instructor
↓
Frontend (HTML/CSS/JavaScript)
↓
Spring Boot REST API
↓
Amazon RDS + Amazon S3 + SNS + Cognito

---

# ส่วนประกอบของระบบ

## Frontend

พัฒนาด้วย HTML, CSS และ JavaScript
ทำหน้าที่แสดงผลข้อมูลและติดต่อกับ Backend ผ่าน REST API

---

## Backend

พัฒนาด้วย Spring Boot
ทำหน้าที่:
- Authentication
- Business Logic
- REST API
- Database Access
- AWS Integration

---

## Amazon RDS

ใช้จัดเก็บข้อมูล:
- Users
- Courses
- Assignments
- Submissions
- Enrollments
- Grades

---

## Amazon S3

ใช้จัดเก็บ:
- Assignment Files
- Submission Files

---

## Amazon Cognito

ใช้สำหรับ:
- Authentication
- JWT Token Validation
- User Management

---

## Amazon SNS

ใช้สำหรับ:
- Email Notification
- Deadline Reminder

---

## Amazon EventBridge

ใช้ Trigger การแจ้งเตือนอัตโนมัติ
เมื่อใกล้ถึง Deadline Assignment
