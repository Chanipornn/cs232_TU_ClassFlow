// 1. API URL (เช็ก Port ให้ตรงกับที่รัน Spring Boot)
const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", async function () {
    const username = localStorage.getItem("username") || "Guest";
    const userDisplay = document.getElementById("username");
    if (userDisplay) userDisplay.innerText = username;

    const list = document.querySelector(".course-list");
    const searchInput = document.querySelector(".search");
    const selectAll = document.querySelector(".course-header input");

    let allCourses = []; 
    let myCourseIds = []; // เก็บเฉพาะ ID วิชาที่ลงทะเบียนแล้ว

    const token = localStorage.getItem("accessToken") || localStorage.getItem("idToken");
    const options = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
        // --- 1. ดึงวิชาที่เราลงทะเบียนแล้ว (My Courses) ---
        // ใช้ Endpoint /assignments/my หรือสร้าง /courses/my ตามใน Spring Boot
        const myRes = await fetch(`${API_URL}/assignments/my`, options); 
        const myData = await myRes.json();
        // เก็บ ID วิชาที่ลงทะเบียนแล้วไว้ใน Array
        myCourseIds = myData.map(item => item.course.id);

        // --- 2. ดึงวิชาทั้งหมด (All Courses) ---
        const allRes = await fetch(`${API_URL}/courses`);
        allCourses = await allRes.json();

        renderCourses(allCourses, myCourseIds);
    } catch (error) {
        console.error("Error loading data:", error);
        if (list) list.innerHTML = "<p style='padding:20px;'>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    }

    // ระบบ Search
    if (searchInput) {
        searchInput.addEventListener("input", function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allCourses.filter(course => 
                (course.name && course.name.toLowerCase().includes(searchTerm)) || 
                (course.code && course.code.toLowerCase().includes(searchTerm))
            );
            renderCourses(filtered, myCourseIds);
        });
    }

    function renderCourses(coursesToRender, enrolledIds) {
        if (!list) return;
        list.innerHTML = "";

        coursesToRender.forEach(course => {
            const isEnrolled = enrolledIds.includes(course.id);
            const row = document.createElement("div");
            row.className = "course-row";
            
            // ถ้าลงทะเบียนแล้ว ให้จางลง หรือห้ามติ๊กซ้ำ
            if (isEnrolled) row.style.opacity = "0.7";

            const instructorName = course.instructor ? course.instructor.email.split('@')[0] : "TBA";

            row.innerHTML = `
                <input type="checkbox" class="course-checkbox" data-id="${course.id}" ${isEnrolled ? 'disabled' : ''}>
                <div class="course-card" onclick="${isEnrolled ? "alert('You already enrolled in this course')" : `goToCourseDetail(${course.id})`}">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span>
                            <b>${course.code || ''} : ${course.name}</b><br>
                            <small>Instructor: ${instructorName}</small>
                        </span>
                        ${isEnrolled ? '<span class="enrolled-badge">✓ Enrolled</span>' : ''}
                    </div>
                </div>
            `;
            list.appendChild(row);
        });
    }

    // ระบบ Select All (จะเลือกเฉพาะตัวที่ไม่ได้ disabled)
    if (selectAll) {
        selectAll.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".course-checkbox:not(:disabled)");
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