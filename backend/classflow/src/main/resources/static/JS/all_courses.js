document.addEventListener("DOMContentLoaded", function () {
  
  // 1. แสดงชื่อผู้ใช้งาน
  const username = localStorage.getItem("username") || "Guest";
  const userDisplay = document.getElementById("username");
  if (userDisplay) userDisplay.innerText = username;

  const list = document.querySelector(".course-list");

  // 2. ดึงข้อมูลวิชาทั้งหมดจาก Java Backend
  // URL ต้องตรงกับ @RequestMapping("/courses") ใน CourseController
  fetch('http://localhost:8080/courses') 
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(courses => {
      renderCourses(courses);
    })
    .catch(error => {
      console.error("Error:", error);
      list.innerHTML = "<p style='padding:20px;'>ไม่สามารถโหลดข้อมูลวิชาได้ กรุณารัน Backend หรือเช็กฐานข้อมูล</p>";
    });

  // 3. ฟังก์ชันสร้างรายการวิชาบนหน้าเว็บ
  function renderCourses(courses) {
    list.innerHTML = ""; // ล้างข้อมูล Hardcode เก่าออก

    if (courses.length === 0) {
      list.innerHTML = "<p style='padding:20px;'>ยังไม่มีรายชื่อวิชาในระบบ</p>";
      return;
    }

    courses.forEach(course => {
      const row = document.createElement("div");
      row.className = "course-row";

      // ดึงชื่ออาจารย์ (ถ้ามี Object instructor)
      const instructorName = course.instructor ? course.instructor.email : "Not assigned";

      row.innerHTML = `
        <input type="checkbox" class="course-checkbox" data-id="${course.id}">
        <div class="course-card" onclick="goToCourse(${course.id})">
          <b>${course.code || 'No Code'} : ${course.name || 'Untitled Course'}</b><br>
          <small>Instructor: ${instructorName}</small>
        </div>
      `;
      list.appendChild(row);
    });
  }
});

// 4. ฟังก์ชันเมื่อคลิกที่วิชา (ไปหน้าดูรายละเอียดงาน)
function goToCourse(courseId) {
  window.location.href = `assignment_all.html?courseId=${courseId}`;
}

// 5. ฟังก์ชัน Enroll (ต้องใช้ Token)
function enrollSelected() {
 
  const checked = document.querySelectorAll(".course-checkbox:checked");
  const token = localStorage.getItem("accessToken");

  if (checked.length === 0) {
    alert("โปรดเลือกวิชาที่ต้องการลงทะเบียน");
    return;
  }

  if (!token) {
    alert("กรุณาเข้าสู่ระบบก่อนลงทะเบียน");
    return;
  }

  // ส่งข้อมูล Enroll ไปที่ Backend ทีละวิชา
  const promises = Array.from(checked).map(cb => {
    const courseId = cb.dataset.id;
    return fetch(`http://localhost:8080/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  });

  Promise.all(promises)
    .then(() => {
      alert("ลงทะเบียนสำเร็จ!");
      window.location.href = "dashboard_student.html";
    })
    .catch(err => alert("เกิดข้อผิดพลาดในการลงทะเบียน"));
}