const API_URL_BASE = "http://localhost:8080";
let allAssignments = [];

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId');

async function fetchAssignments(filter = "all") {
    try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("idToken");
        let options = {};
        if (token) {
            options.headers = { 'Authorization': `Bearer ${token}` };
        }

        // 1. ดึงชื่อวิชา (Header)
        if (courseId) {
            fetch(`${API_URL_BASE}/courses/${courseId}`, options)
                .then(res => res.json())
                .then(course => {
                    document.getElementById("courseTitle").innerText = `${course.code} ${course.name}`;
                    const instName = course.instructor ? course.instructor.email.split('@')[0] : "TBA";
                    document.getElementById("instructorName").innerText = `Instructor: ${instName}`;
                })
                .catch(err => console.log("Header Error:", err));
        }

        // 2. ดึงรายการ Assignment
        let url = courseId 
            ? `${API_URL_BASE}/assignments/course/${courseId}` 
            : `${API_URL_BASE}/assignments/my`;
            
        const response = await fetch(url, options);
        const data = await response.json();
        
        // ตรวจสอบว่ามีข้อมูลส่งมาไหม
        if (data && Array.isArray(data)) {
            allAssignments = data;
            updateSummary(); 
            renderAssignments(filter); 
        } else {
            console.log("No assignments found or data is not array");
            renderAssignments(filter); // เรียกเพื่อให้โชว์ข้อความ "No assignments"
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function renderAssignments(filter) {
    const container = document.getElementById("assignmentContainer");
    if (!container) return;
    container.innerHTML = "";

    // ถ้าไม่มีงานเลย ให้บอกว่าว่างเปล่า
    if (allAssignments.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:50px; color:gray;">ยังไม่มีรายการงานในขณะนี้</p>`;
        return;
    }

    let filtered = allAssignments;

    // กรองตามสถานะ (ถ้าใน DB ยังไม่มี field status ให้ข้ามส่วนนี้ไปก่อนเพื่อให้งานโชว์)
    if (filter === "submitted") {
        filtered = allAssignments.filter(a => a.submitted === true);
    } else if (filter === "pending") {
        filtered = allAssignments.filter(a => a.submitted === false || a.submitted === undefined);
    }

    filtered.forEach(a => {
        // ใช้ค่า submitted (boolean) ที่เราเพิ่งแก้ใน Java
        let statusClass = a.submitted ? "green" : "red";
        let statusText = a.submitted ? "Submitted" : "Not Submitted";

        const card = `
            <div class="card" onclick="goToAssignmentDetail(${a.id})" style="cursor: pointer;">
                <div>
                    <h3>${a.title}</h3>
                    <p>Deadline: ${a.deadline || "No deadline"}</p>
                </div>
                <span class="status ${statusClass}">${statusText}</span>
            </div>
        `;
        container.innerHTML += card;
    });
}

function updateSummary() {
    const total = allAssignments.length;
    document.getElementById("totalAssignments").innerText = "Assignments: " + total;
    // ปรับ Progress Bar เบื้องต้น
    const submittedCount = allAssignments.filter(a => a.submitted === true).length;
    const percent = total === 0 ? 0 : (submittedCount / total) * 100;
    if(document.getElementById("progressBar")) {
        document.getElementById("progressBar").style.width = percent + "%";
    }
}

function switchTab(page) {
    if (courseId) {
        window.location.href = `${page}?courseId=${courseId}`;
    } else {
        window.location.href = page;
    }
}

function goToAssignmentDetail(assignmentId) {
    window.location.href = `assignment_detail.html?id=${assignmentId}&courseId=${courseId}`;
}

function searchAssignment(keyword, filter) {
  const container = document.getElementById("assignmentContainer");
  container.innerHTML = "";

  let filtered = allAssignments;

  if (filter !== "all") {
    filtered = filtered.filter(a => a.status === filter);
  }

  filtered = filtered.filter(a =>
    a.title.toLowerCase().includes(keyword.toLowerCase())
  );

  filtered.forEach(a => {
    const card = `
      <div class="card">
        <div>
          <h3>${a.title}</h3>
          <p>Deadline: ${a.deadline}</p>
        </div>
        <span class="status">${a.status}</span>
      </div>
    `;
    container.innerHTML += card;
  });
}