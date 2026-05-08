// API URL 
const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", function () {
    // โหลดข้อมูลชื่อผู้ใช้จาก localStorage
    displayUsername();

    // โหลดข้อมูลวิชาที่ลงทะเบียนไว้จาก Database
    loadMyCourses();

    // เริ่มการทำงานของปฏิทิน
    initCalendar();
});

// ===== แสดงชื่อผู้ใช้งาน (ดึงจาก Email ใน Token) =====
function displayUsername() {
    const token = localStorage.getItem("idToken") || localStorage.getItem("accessToken");
    if (!token) return;

    try {
        // Decode JWT เพื่อเอา Email
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.email || payload["cognito:username"] || "Guest";
        const name = email.split("@")[0]; // เอาแค่ชื่อหน้า @
        
        const usernameElement = document.getElementById("username");
        if (usernameElement) usernameElement.textContent = name;
        
        // เก็บชื่อไว้ใน localStorage เผื่อหน้าอื่นใช้
        localStorage.setItem("username", name);
    } catch (e) {
        console.error("Error decoding token:", e);
    }
}

// ===== ดึงข้อมูลวิชาที่ลงทะเบียน (My Courses) จาก Backend =====
async function loadMyCourses() {
    const container = document.getElementById("myCoursesContainer");
    const token = localStorage.getItem("accessToken") || localStorage.getItem("idToken");

    if (!container) return;

    try {
        if (!token) {
            container.innerHTML = "<p style='padding:20px;'>กรุณาเข้าสู่ระบบ</p>";
            return;
        }

        const res = await fetch(`${API_URL}/courses/my`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Fetch failed");

        const courses = await res.json();
        renderCourses(courses);

    } catch (err) {
        console.error("Load courses error:", err);
        container.innerHTML = "<p style='padding:20px;'>ไม่สามารถเชื่อมต่อฐานข้อมูลได้</p>";
    }
}

// ===== Card  =====
function renderCourses(courses) {
  const container = document.getElementById("myCoursesContainer");
  container.innerHTML = "";

  if (!courses || courses.length === 0) {
    container.innerHTML = "<p style='padding:20px;'>No courses enrolled.</p>";
    return;
  }

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card-item"; // ใช้ Class ตาม CSS ใหม่ด้านล่าง
    card.onclick = () => window.location.href = `assignment_all.html?courseId=${course.id}`;

    // จัดรูปแบบวันที่ Deadline ให้ดูง่าย (เช่น 15 Mar)
    let deadlineText = "-";
    if (course.nextDeadline) {
      const d = new Date(course.nextDeadline);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      deadlineText = `${d.getDate()} ${months[d.getMonth()]}`;
    }

    card.innerHTML = `
      <div class="course-content">
        <b class="course-title">${course.code} ${course.name}</b>
        <div class="course-info-list">
          <p>Instructor: ${course.instructor ? course.instructor.email.split('@')[0] : "TBA"}</p>
          <p>Assignments: ${course.assignmentCount || 0}</p>
          <p>Next Deadline: ${deadlineText}</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ===== FullCalendar =====
function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        height: 300,
        fixedWeekCount: false
    });
    calendar.render();
}

// ===== Search Courses =====
function searchCourse() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const container = document.getElementById('myCoursesContainer');
    
    const cards = container.getElementsByClassName('course-card-item');

    for (let i = 0; i < cards.length; i++) {
        const titleElement = cards[i].querySelector('.course-title'); 
        
        if (titleElement) {
            const titleText = titleElement.innerText.toLowerCase();
            
            if (titleText.indexOf(filter) > -1) {
                cards[i].style.display = ""; // แสดงการ์ดใบนี้
            } else {
                cards[i].style.display = "none"; // ซ่อนการ์ดใบนี้
            }
        }
    }
}

// ===== Navigation =====
function goToAllCourses() {
    window.location.href = "all_courses.html";
}

function goToCourseDetail(courseId) {
    // ส่ง ID วิชาไปที่หน้า Assignment (ปรับชื่อไฟล์ตามจริงของคุณ)
    window.location.href = `assignment_all.html?courseId=${courseId}`;
}



//การแจ้งเตือน (Notification) - ดึงจำนวนการแจ้งเตือนที่ยังไม่อ่านมาแสดงบน Badge
async function fetchNotifCount() {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:8080/api/notifications/student", {
            headers: { "Authorization": "Bearer " + token }
        });
        const notifications = await response.json();

        const unread = notifications.filter(n => !n.isRead).length;
        const badge = document.getElementById("notif-badge");

        if (badge && unread > 0) {
            badge.textContent = unread;
            badge.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchNotifCount);