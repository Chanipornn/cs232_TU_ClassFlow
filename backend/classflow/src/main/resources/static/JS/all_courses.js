// 1. API URL (เช็ก Port ให้ตรงกับที่รัน Spring Boot)
const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", function () {
    
    // --- แสดงชื่อผู้ใช้งานที่หัวเว็บ ---
    const username = localStorage.getItem("username") || "Guest";
    const userDisplay = document.getElementById("username");
    if (userDisplay) userDisplay.innerText = username;

    const list = document.querySelector(".course-list");
    const searchInput = document.querySelector(".search");
    const selectAll = document.querySelector(".course-header input");

    let allCourses = []; // เก็บวิชาทั้งหมดจาก DB ไว้สำหรับทำ Search

    // --- 2. ดึงข้อมูลวิชาทั้งหมดจาก Java Backend ---
    fetch(`${API_URL}/courses`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(courses => {
            allCourses = courses;
            renderCourses(allCourses); // แสดงผลวิชาทั้งหมดตอนโหลดหน้า
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
            if (list) list.innerHTML = "<p style='padding:20px;'>ไม่สามารถโหลดข้อมูลวิชาได้ (Check Backend/Database)</p>";
        });

    // --- 3. ระบบ Search (ค้นหาชื่อวิชาหรือรหัสวิชา) ---
    if (searchInput) {
        searchInput.addEventListener("input", function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allCourses.filter(course => 
                (course.name && course.name.toLowerCase().includes(searchTerm)) || 
                (course.code && course.code.toLowerCase().includes(searchTerm))
            );
            renderCourses(filtered);
        });
    }

    // --- 4. ฟังก์ชัน Render รายการวิชา ---
    function renderCourses(coursesToRender) {
        if (!list) return;
        list.innerHTML = "";

        if (coursesToRender.length === 0) {
            list.innerHTML = "<p style='padding:20px;'>ไม่พบรายชื่อวิชา</p>";
            return;
        }

        coursesToRender.forEach(course => {
            const row = document.createElement("div");
            row.className = "course-row";

            const instructorName = course.instructor ? course.instructor.email.split('@')[0] : "TBA";

            row.innerHTML = `
                <input type="checkbox" class="course-checkbox" data-id="${course.id}">
                <div class="course-card" onclick="goToCourseDetail(${course.id})">
                    <b>${course.code || ''} : ${course.name}</b><br>
                    <small>Instructor: ${instructorName}</small>
                </div>
            `;
            list.appendChild(row);
        });
    }

    // --- 5. ระบบ Select All ---
    if (selectAll) {
        selectAll.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".course-checkbox");
            checkboxes.forEach(cb => cb.checked = selectAll.checked);
        });
    }
});

// --- 6. ฟังก์ชันเมื่อคลิกที่ตัวการ์ดวิชา ---
function goToCourseDetail(courseId) {
    // ปรับชื่อไฟล์เป้าหมายตามจริง (เช่น assignment_all.html)
    window.location.href = `assignment_all.html?courseId=${courseId}`;
}

// --- 7. ฟังก์ชัน Enroll (บันทึกลง Database จริง) ---
function enrollSelected() {

    const checked = document.querySelectorAll(".course-checkbox:checked");
    const token = localStorage.getItem("accessToken") || localStorage.getItem("idToken");
    const enrollBtn = document.querySelector(".enroll-btn");

    if (checked.length === 0) {
        alert("กรุณาเลือกวิชาที่ต้องการลงทะเบียน");
        return;
    }

    if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
        return;
    }

    // ปิดปุ่มชั่วคราว
    if (enrollBtn) enrollBtn.disabled = true;

    // เตรียมการส่งข้อมูลแบบหลายวิชาพร้อมกัน
    const promises = Array.from(checked).map(cb => {
        const courseId = cb.dataset.id;
        return fetch(`${API_URL}/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok) throw new Error("Enrollment failed for ID: " + courseId);
            return res.json();
        });
    });

    Promise.all(promises)
        .then(() => {
            alert("ลงทะเบียนสำเร็จเรียบร้อยแล้ว!");
            // เคลียร์ checkbox
            document.querySelectorAll(".course-checkbox").forEach(cb => cb.checked = false);
            // เด้งไปหน้า Dashboard ทันที
            window.location.href = "dashboard_student.html";
        })
        .catch(err => {
            console.error("Enroll error:", err);
            alert("เกิดข้อผิดพลาดในการลงทะเบียน (วิชานี้อาจจะเคยลงไปแล้ว)");
        })
        .finally(() => {
            if (enrollBtn) enrollBtn.disabled = false;
        });
}