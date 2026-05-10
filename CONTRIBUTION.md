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
- พัฒนา Frontend ของระบบ
- ออกแบบและพัฒนา User Interface ของเว็บไซต์ให้ตรงตามโครงสร้างที่กำหนด
- ปรับปรุงแก้ไข UI ให้สอดคล้องกันทั้งเว็บฝั่ง student และ instructor

### งานที่พัฒนา

#### Frontend Development
- พัฒนาหน้า Login และ Sign Up โดยเขียน JS เพื่อทำ mock data รอเชื่อมต่อกับ Amazon Cognito
- พัฒนาหน้า Dashboard ฝั่ง Student และ Instructor
- พัฒนาหน้า all_courses โดยเขียน JS เพื่อทำ mock data
- พัฒนาฟังก์ชันสร้างวิชาสำหรับเว็บ instructor

### ตัวอย่าง Commit
- Update create courses
- Edit css and Add js
- Fix Layout for Student
- Create Profile Page and Edit Header color
- Update dashboard_instructor and integrate course, enrollment, and calendar functionality
- Update validation Profile

### ผลลัพธ์ที่ได้


หลักฐาน:
- ผู้ใช้สามารถกรอกข้อมูลสำหรับ Login และ Sign Up ได้
- หน้า Dashboard แสดงข้อมูลและ UI ครบทั้งฝั่ง Student และ Instructor
- สามารถกดสร้างวิชาและเลือกวิชาได้ (mock data)

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
- อัดและตัดต่อคลิปนำเสนอผลงานของกลุ่ม

### งานที่พัฒนา

#### Backend Development
- สร้างและพัฒนาตารางที่เกี่ยวข้องกับระบบ เช่น Course, Enrollment, Assignment และ Notification
- สร้าง Repository สำหรับเชื่อมต่อข้อมูลระหว่าง Spring Boot และฐานข้อมูล
- สร้าง Controller สำหรับจัดการข้อมูล Assignment, Course และ Notification

#### Amazon S3 Integration
- เพิ่ม dependency และ config ที่เกี่ยวข้องกับ Amazon S3 ใน pom.xml และ application.properties
- ตั้งค่า S3 Bucket สำหรับจัดเก็บไฟล์ submission ของนักศึกษา
- กำหนดค่า AWS credentials, region และ bucket name ใน application.properties
- เชื่อมต่อ Spring Boot Backend กับ Amazon S3 เพื่อให้ระบบสามารถอัปโหลดไฟล์ไปยัง bucket ได้
- ตรวจสอบปัญหาเกี่ยวกับ permission และ credential เช่น access key, secret key และ session token

#### Upload File System
- ตรวจสอบว่าไฟล์ที่อัปโหลดถูกส่งไปยัง S3 Bucket ได้จริง
- พัฒนาฟังก์ชันสำหรับให้นักศึกษาอัปโหลดไฟล์งานผ่านหน้าเว็บ
- ทดสอบการส่งงานของนักศึกษา และตรวจสอบสถานะการส่งงานผ่านฐานข้อมูล

### หลักฐานการทำงาน

### ตัวอย่าง Commit

- สร้าง controller assignment/course/notification
- สร้าง SecurityConfig
- เพิ่ม S3 ใน pom/application.properties
- ลบ Config อันเก่าสุดเพราะมีอยู่แล้ว สร้าง S3Service/SubmissionController
- แก้ S3Service ให้เชื่อมใน AWS ได้

### ผลลัพธ์ที่ได้

- ระบบ Backend มีตารางและ Repository ที่รองรับข้อมูล Course, Enrollment, Assignment และ Notification
- ระบบสามารถเชื่อมต่อกับ Amazon S3 ผ่าน S3Service ได้
- มี SubmissionController สำหรับจัดการการส่งงานและอัปโหลดไฟล์
- สามารถอัปโหลดไฟล์งานไปยัง S3 Bucket ได้
- ข้อมูลการส่งงานสามารถนำไปเช็กในฐานข้อมูลได้


---

## นางสาวมณีรัตน์ อุ่นตาล

หน้าที่:
- 

หลักฐาน: 


---

## นางสาวอชิรญา ขำปลอดภัย 

### หน้าที่รับผิดชอบ
- พัฒนา Frontend ของระบบ
- ออกแบบและพัฒนา User Interface ของเว็บไซต์ให้ตรงตามโครงสร้างที่กำหนด 
- รองรับการใช้งานของผู้ใช้ทั้งฝั่ง Student และ Instructor

### งานที่พัฒนา

#### Frontend Development
- พัฒนาหน้า Notification และการแสดงสถานะงาน ฝั่ง Student และ Instructor
- พัฒนาหน้า สถานะการส่งงาน ฝั่ง Student
- พัฒนาหน้า View all assignment
- พัฒนาหน้า Add Assignment และ Assignment Detail

### หลักฐานการทำงาน
### ตัวอย่าง Commit
- Create view all assignment instructor
- Create Add_assignment instructor Assignment_detail_instructor
- update view all assignment page and create late submitted page
- Update Done-submitted Page UI + edit submitted_before.css
- Update notification Page UI

### ผลลัพธ์ที่ได้
- ระบบ Frontend สามารถใช้งานได้ทั้งฝั่ง Student และ Instructor
- ผู้ใช้งานสามารถดู Assignment, สถานะการส่งงาน และ Feedback ได้
- ระบบสามารถแสดงสถานะการส่งงานและ Notification ได้
- รองรับการเชื่อมต่อกับ Backend