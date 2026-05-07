const API_BASE_URL = "http://localhost:8080";
const token = localStorage.getItem("idToken");

const params = new URLSearchParams(window.location.search);
const currentPage = window.location.pathname;
const courseId = params.get("courseId");

// ================= INIT =================
window.addEventListener("DOMContentLoaded", async () => {
  setupBackButton();
  setupSaveButton();
  setupSearch();
  setupAccordions();
  setupCancelButton();
  
  document.querySelectorAll(".tab-btn").forEach(tab => {

    const href = tab.getAttribute("href");

    tab.href = `${href}?courseId=${courseId}`;
  });
  
  await loadCourseInfo();

  if (document.getElementById("assignmentList")) {
    await loadAssignments();
  }

  if (window.location.pathname.includes("create_assignment_form.html")) {
    await loadAssignmentForEdit();
  }
});

// ================= COURSE =================
async function loadCourseInfo() {
  if (!courseId) return;

  try {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Course not found");

    const course = await res.json();
	
	const countRes = await fetch(
	  `${API_BASE_URL}/courses/${courseId}/student-count`,
	  {
	    headers: {
	      "Authorization": `Bearer ${token}`
	    }
	  }
	);

	const studentCount = await countRes.text();

	const studentEl =
	  document.getElementById("studentCount");

	if (studentEl) {
	  studentEl.textContent = studentCount;
	}

    const el = document.getElementById("courseTitle");
    if (el) {
      el.textContent =
        `${course.code || "-"} - ${course.name || "-"} (Sec ${course.section || "-"})`;
    }

    // set create btn link
    const createBtn = document.querySelector(".create-btn");
    if (createBtn) {
      createBtn.href = `create_assignment_form.html?courseId=${courseId}`;
    }

  } catch (err) {
    console.error(err);
  }
}

// ================= BACK BUTTON =================
function setupBackButton() {
  const backBtn = document.getElementById("backBtn");

  if (backBtn && courseId) {
    backBtn.onclick = () => {
      window.location.href = `create_assignments_all.html?courseId=${courseId}`;
    };
  }
}

// ================= ASSIGNMENTS =================
let allAssignments = [];

async function loadAssignments() {
  const list = document.getElementById("assignmentList");
  const countEl = document.getElementById("assignmentCount");

  if (!list) return;

  showLoading(list);

  try {
    const res = await fetch(`${API_BASE_URL}/assignments/course/${courseId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    allAssignments = Array.isArray(data) ? data : [];

    if (countEl) countEl.textContent = allAssignments.length;

    renderAssignments(allAssignments);

  } catch (err) {
    console.error(err);
    list.innerHTML = `<p>โหลดข้อมูลไม่สำเร็จ</p>`;
  }
}

function renderAssignments(assignments) {

  const assignmentList =
    document.getElementById("assignmentList");

  assignmentList.innerHTML = "";

  const now = new Date();

  // ================= FILTER =================

  if (currentPage.includes("active")) {

    assignments = assignments.filter(a => {

      if (!a.deadline) return false;

      const deadline =
        new Date(a.deadline.replace(" ", "T"));

      return deadline > now;
    });
  }

  if (currentPage.includes("closed")) {

    assignments = assignments.filter(a => {

      if (!a.deadline) return false;

      const deadline =
        new Date(a.deadline.replace(" ", "T"));

      return deadline <= now;
    });
  }

  // ================= COUNT =================

  const countEl =
    document.getElementById("assignmentCount");

  if (countEl) {
    countEl.textContent = assignments.length;
  }

  // ================= EMPTY =================

  if (assignments.length === 0) {

    assignmentList.innerHTML = `
      <div class="empty-state">
        <h2>No assignments found</h2>
      </div>
    `;

    return;
  }

  // ================= RENDER =================

  assignments.forEach(a => {

    let deadlineText = "-";

    if (a.deadline) {

      const d =
        new Date(a.deadline.replace(" ", "T"));

      deadlineText =
        d.toLocaleDateString("th-TH");
    }

    assignmentList.innerHTML += `

      <div class="assignment-card">

        <h2>${a.title}</h2>

        <p>${a.description || "-"}</p>

        <strong>
          Deadline: ${deadlineText}
        </strong>

      </div>
    `;
  });
}

/*
function renderAssignments(data) {
  const list = document.getElementById("assignmentList");
  if (!list) return;

  if (data.length === 0) {
    list.innerHTML = `<p>ไม่มี assignment</p>`;
    return;
  }

  list.innerHTML = data.map(a => `
    <div class="assignment-card">
      <h3>${a.title}</h3>
      <p>${a.description}</p>
      <p>Deadline: ${formatDate(a.deadline || a.dueDate)}</p>
    </div>
  `).join("");
}
*/

// ================= SEARCH =================
function setupSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    const keyword = input.value.toLowerCase();

    const filtered = allAssignments.filter(a =>
      (a.title || "").toLowerCase().includes(keyword) ||
      (a.description || "").toLowerCase().includes(keyword)
    );

    renderAssignments(filtered);
  });
}

// ================= CREATE / SAVE / CANCEL =================
function setupSaveButton() {
  const btn = document.getElementById("saveAssignmentBtn");
  if (!btn) return;

  btn.onclick = async (e) => {
    e.preventDefault();

    if (!courseId) {
      alert("No courseId");
      return;
    }

    const payload = {
      title: document.getElementById("assignmentTitle")?.value || "Assignment",
      description: document.getElementById("assignmentDescription")?.value || "",
      deadline: document.getElementById("assignmentDeadline")?.value || null,
      status: "active",
      course: {
        id: courseId
      }
    };

    try {
      const res = await fetch(`${API_BASE_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Create failed");

      alert("Created");

      window.location.href = `create_assignments_all.html?courseId=${courseId}`;

    } catch (err) {
      console.error(err);
      alert("สร้างไม่สำเร็จ");
    }
  };
}

function setupCancelButton() {
  const btn = document.getElementById("cancelBtn");

  if (btn && courseId) {
    btn.onclick = () => {
      window.location.href = `create_assignments_all.html?courseId=${courseId}`;
    };
  }
}

// ================= EDIT =================
async function loadAssignmentForEdit() {
  const id = params.get("id");
  if (!id) return;

  try {
    const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Load failed");

    const data = await res.json();

    document.getElementById("assignmentTitle").value = data.title || "";
    document.getElementById("assignmentDescription").value = data.description || "";
    document.getElementById("assignmentDeadline").value =
      toDateTimeLocalValue(data.deadline || data.dueDate);

  } catch (err) {
    console.error(err);
  }
}

// ================= UI =================
function setupAccordions() {
  document.querySelectorAll(".accordion-header").forEach(header => {
    header.onclick = () => header.parentElement.classList.toggle("open");
  });
}

function showLoading(el) {
  el.innerHTML = "<p>Loading...</p>";
}

// ================= UTIL =================
function formatDate(val) {
  if (!val) return "-";
  const d = new Date(val);
  return d.toLocaleDateString();
}

function toDateTimeLocalValue(val) {
  if (!val) return "";
  const d = new Date(val);
  return d.toISOString().slice(0, 16);
}