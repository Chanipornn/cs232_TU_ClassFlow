const API_URL = "http://localhost:8080/assignments";

let allAssignments = [];


// แก้ให้ส่ง Token ไปด้วยตอนเรียก API เพื่อดึงข้อมูล Assignment ของผู้ใช้ที่ล็อกอินอยู่
async function fetchAssignments() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');

    try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("idToken");
        
        let url;
        let options = {};
        
        if (courseId) {
            url = `http://localhost:8080/assignments/course/${courseId}`;
        } else {
            url = `http://localhost:8080/assignments/my`;
            if (token) {
                options.headers = {
                    'Authorization': `Bearer ${token}`
                };
            }
        }
        
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
            allAssignments = data;
            updateSummary(); 
            renderAssignments('all');
        } else {
            console.error("Data is not an array:", data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}
/*
async function fetchAssignments(filter = "all") {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    allAssignments = data;

    updateSummary();
    renderAssignments(filter);

  } catch (err) {
    console.error("Error:", err);
  }
}
*/
function updateSummary() {
  const total = allAssignments.length;
  const submitted = allAssignments.filter(a => a.status === "submitted").length;

  document.getElementById("totalAssignments").innerText =
    "Assignments: " + total;

  const percent = total === 0 ? 0 : (submitted / total) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function renderAssignments(filter) {
  const container = document.getElementById("assignmentContainer");
  container.innerHTML = "";

  let filtered = allAssignments;

  if (filter !== "all") {
    filtered = allAssignments.filter(a => a.status === filter);
  }

  filtered.forEach(a => {
    let statusClass = "";
    let statusText = "";

    if (a.status === "submitted") {
      statusClass = "green";
      statusText = "Submitted";
    } else if (a.status === "pending") {
      statusClass = "yellow";
      statusText = "Pending";
    } else {
      statusClass = "red";
      statusText = "Not Submitted";
    }

    // ← เพิ่ม onclick และ style: cursor
    const card = `
      <div class="card" onclick="goToAssignmentDetail(${a.id})" style="cursor: pointer;">
        <div>
          <h3>${a.title}</h3>
          <p>Deadline: ${a.deadline}</p>
        </div>
        <span class="status ${statusClass}">${statusText}</span>
      </div>
    `;

    container.innerHTML += card;
  });
}


//function goToAssignmentDetail(assignmentId) {
function goToAssignmentDetail(assignmentId) {
    window.location.href = `assignment_detail.html?id=${assignmentId}`;
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