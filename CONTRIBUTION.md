# การแบ่งหน้าที่ของสมาชิก

## สมาชิกภายในทีม

| ชื่อ | รหัสนักศึกษา | หน้าที่ |
|---|---|---|
| นางสาวชญาณ์นันท์ มะริวรรณ์  | 6709650219 | Backend, Cognito, RDS |
| นางสาวชนิภรณ์ คิมประเสริฐ  | 6709650243 | Frontend, Backend |
| นางสาวปุนยานุช แซ่แจ้ง  | 6709650482 | Backend, Amazon S3 |
| นางสาวพัทธนันท์ บรรทัด  | 6709650516 | Backend, SNS และ EventBridge |
| นางสาวแพรพลอย	พิพัฒน์ภาธรกุล | 6709650540 | Backend, Amazon S3 |
| นางสาวมณีรัตน์ อุ่นตาล  | 6709650599 | Frontend |
| นางสาวอชิรญา ขำปลอดภัย  | 6709650714 | Frontend |

---

# รายละเอียด Contribution

## นางสาวชญาณ์นันท์ มะริวรรณ์

### หน้าที่รับผิดชอบ

รับผิดชอบการพัฒนา Backend หลักของระบบในส่วน Instructor
รวมถึงการเชื่อมต่อระบบกับบริการต่าง ๆ บน AWS ได้แก่
Amazon RDS และ Amazon Cognito

### งานที่พัฒนา

#### Backend Development (Instructor Side)

- พัฒนา REST API สำหรับฝั่งอาจารย์
- พัฒนาระบบสร้าง Assignment
- พัฒนาระบบแก้ไขและลบ Assignment
- พัฒนาระบบดู Submission ของนักศึกษา
- พัฒนาระบบ Feedback และ Grading
- พัฒนาระบบแสดงสถานะการตรวจงาน
- พัฒนาระบบ Download Assignment Files

#### Amazon RDS Integration

- เชื่อม Spring Boot กับ Amazon RDS

#### Amazon Cognito Integration

- เชื่อมระบบ Login กับ Amazon Cognito
- จัดการ Authentication Flow & JWT Token
- พัฒนาระบบแยกสิทธิ์ Student / Instructor

### หลักฐานการทำงาน

### ตัวอย่าง Commit
- fix API role and create course (Instructor)
- create course and assignment (Instructor)
- add attachment files and edit assignment cards (Instructor)
- create return feedback to student
- connect Mysql to RDS

### ผลลัพธ์ที่ได้

- ระบบ Backend สามารถทำงานร่วมกับ Frontend ได้แบบ End-to-End
- ระบบสามารถจัดเก็บข้อมูลจริงบน Amazon RDS
- ระบบรองรับ Authentication ผ่าน Amazon Cognito
- อาจารย์สามารถสร้าง Assignment ตรวจงาน และให้ Feedback ได้จริง

---

## นางสาวชนิภรณ์ คิมประเสริฐ

หน้าที่:
- 

หลักฐาน:


---

## นางสาวปุนยานุช แซ่แจ้ง 

หน้าที่:
- เชื่อม Amazon S3
- พัฒนาระบบ Upload File
- ตั้งค่า S3 Bucket และ Permission

หลักฐาน:


---

## นางสาวพัทธนันท์ บรรทัด

หน้าที่:
- เชื่อม Amazon SNS
- ตั้งค่า Amazon EventBridge
- พัฒนาระบบ Deadline Notification
- ทดสอบระบบ Email Notification

หลักฐาน:


---

## นางสาวแพรพลอย	พิพัฒน์ภาธรกุล

หน้าที่:
- เชื่อม Amazon S3
- พัฒนาระบบ Upload File
- ตั้งค่า S3 Bucket และ Permission

หลักฐาน:


---

## นางสาวมณีรัตน์ อุ่นตาล

หน้าที่:
- 

หลักฐาน:


---

## นางสาวอชิรญา ขำปลอดภัย 

หน้าที่:
- 

หลักฐาน:
