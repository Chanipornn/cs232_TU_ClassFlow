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

  if (window.location.pathname.includes("edit_assignment.html")) {
     await loadAssignmentData();
  }
});

// ================= COURSE =================
async function loadCourseInfo() {
	
  if (!courseId) return;

  try {
	const res = await fetch(
	       `${API_BASE_URL}/courses/${courseId}`,
	       {
	         headers: {
	           "Authorization": `Bearer ${token}`
	         }
	       }
	   );

	   if (!res.ok) {
	     throw new Error("Course not found");
	   }

    const course = await res.json();
	
	// ================= TITLE =================

	    const titleEl =
	        document.getElementById("courseTitle");

	    if (titleEl) {

	      titleEl.innerHTML = `
	        ${course.code || "-"} - ${course.name || "-"}

	        <div style="
	          font-size: 18px;
	          font-weight: 500;
	          margin-top: 8px;
	          opacity: 0.9;
	        ">

	          Instructor :
	          ${course.instructorName ||
	      course.instructor ||
	      "Unknown Instructor"}

	          &nbsp;&nbsp;|&nbsp;&nbsp;

	          Section :
	          ${course.section || "-"}

	          <br>

	          <span style="
	            font-size: 16px;
	            font-weight: 400;
	          ">
	            ${course.description || ""}
	          </span>

	        </div>
	      `;
	    }
		
		// ================= STUDENT COUNT =================

		    const countRes = await fetch(
		        `${API_BASE_URL}/courses/${courseId}/student-count`,
		        {
		          headers: {
		            "Authorization": `Bearer ${token}`
		          }
		        }
		    );

		    const studentCount =
		        await countRes.text();

		    const studentEl =
		        document.getElementById("studentCount");

		    if (studentEl) {

		      studentEl.textContent =
		          studentCount;
		    }

		    // ================= CREATE BTN =================

		    const createBtn =
		        document.querySelector(".create-btn");
	
    
    if (createBtn) {
      createBtn.href = 
	  		`create_assignment_form.html?courseId=${courseId}`;
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


// ================= RENDER =================
function renderAssignments(assignments) {

  const assignmentList =
    document.getElementById("assignmentList");

  assignmentList.innerHTML = "";

  const now = new Date();

  // FILTER 
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

  // COUNT 
  const countEl =
    document.getElementById("assignmentCount");

  if (countEl) {
    countEl.textContent = assignments.length;
  }

  // EMPTY 
  if (assignments.length === 0) {

    assignmentList.innerHTML = `
      <div class="empty-state">
        <h2>No assignments found</h2>
      </div>
    `;

    return;
  }

  assignments.forEach(a => {

    let deadlineText = "-";

    if (a.deadline) {

      const d =
        new Date(a.deadline.replace(" ", "T"));

      deadlineText =
        d.toLocaleDateString("th-TH");
    }

    assignmentList.innerHTML += `

      <div class="assignment-card" onclick="goToEdit(${a.id})">

        <h2>${a.title}</h2>

        <p>${a.description || "-"}</p>

        <strong>
          Deadline: ${deadlineText}
        </strong>

      </div>
    `;
  });
}


// ================= FILE PREVIEW =================

const fileInput =
  document.getElementById("assignmentFile");

if (fileInput) {

  fileInput.addEventListener("change", () => {

    const fileList =
      document.getElementById("fileList");

    if (fileInput.files.length === 0) {

      fileList.innerHTML =
        "No files selected";

      return;
    }

    fileList.innerHTML = "";

    Array.from(fileInput.files)
      .forEach(file => {

        fileList.innerHTML += `
          <div class="file-item">
            📄 ${file.name}
          </div>
        `;
      });
  });
}



// ================= CREATE ASSIGNMENT =================
async function createAssignment(courseId) {

  try {

    const title =
      document.getElementById("assignmentTitle").value;

    const description =
      document.getElementById("assignmentDescription").value;
	  
	  const requirements =
	    document.getElementById("assignmentRequirements").value;

    const deadline =
      document.getElementById("assignmentDeadline").value;

    const fileInput =
      document.getElementById("assignmentFile");

    const formData = new FormData();

    formData.append("title", title);

    formData.append("description", description);
	formData.append("requirements", requirements);

    formData.append("deadline", deadline);

    formData.append("courseId", courseId);

    
    // MULTIPLE FILES
    if (fileInput.files.length > 0) {

      Array.from(fileInput.files)
        .forEach(file => {

          console.log("UPLOAD:", file.name);

          formData.append("files", file);

        });
    }

	console.log(fileInput.files);
	console.log(fileInput.files.length);

	for (let i = 0; i < fileInput.files.length; i++) {

	  console.log(
	    "SEND FILE:",
	    fileInput.files[i].name
	  );
	}
	
    const res = await fetch(
      "http://localhost:8080/assignments/upload",
      {
        method: "POST",

        headers: {
			Authorization:
			  "Bearer " + localStorage.getItem("idToken")
        },

        body: formData
      }
    );
	
	

    if (!res.ok) {
      throw new Error("Create failed");
    }

    alert("สร้าง assignment สำเร็จ");

    window.location.href =
      `create_assignments_all.html?courseId=${courseId}`;

  } catch (err) {

    console.error(err);

    alert("สร้าง assignment ไม่สำเร็จ");
  }
  
  
}


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

  const btn =
    document.getElementById("saveAssignmentBtn");

  if (!btn) return;

  btn.onclick = async (e) => {

    e.preventDefault();

    if (!courseId) {

      alert("No courseId");

      return;
    }

    await createAssignment(courseId);
  };
}
/*
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
*/

function setupCancelButton() {
  const btn = document.getElementById("cancelBtn");

  if (btn && courseId) {
    btn.onclick = () => {
      window.location.href = `create_assignments_all.html?courseId=${courseId}`;
    };
  }
}


// ================= LOAD OLD DATA =================

async function loadAssignmentData() {

  const params =
    new URLSearchParams(window.location.search);

  const id = params.get("id");

  if (!id) return;

  const res = await fetch(
    `http://localhost:8080/assignments/${id}`
  );

  const assignment =
    await res.json();
	
	// ================= FILES =================

	const fileList =
	  document.getElementById("fileList");

	if (
	  assignment.files &&
	  assignment.files.length > 0
	) {

	  fileList.innerHTML = "";
	  
	  assignment.files.forEach(file => {

	    const fileUrl =
	      `http://localhost:8080/assignments/files/${file.fileName}`;

	    fileList.innerHTML += `

	      <div class="file-item">

	        📄 ${file.fileName}

	        <a
	          href="${fileUrl}"
	          target="_blank"
	          class="preview-btn"
	        >
	          Preview
	        </a>

	        <a
	          href="${fileUrl}"
	          download
	          class="download-btn"
	        >
	          Download
	        </a>

	      </div>
	    `;
	  });
/*
	  assignment.files.forEach(file => {

	    fileList.innerHTML += `
	      <div class="file-item">
	        📄 ${file.fileName}
	      </div>
	    `;
	  });
*/
	} else {

	  fileList.innerHTML =
	    "No files selected";
	}

  
  // FILL FORM
  document.getElementById(
    "assignmentTitle"
  ).value =
    assignment.title || "";

  document.getElementById(
    "assignmentDescription"
  ).value =
    assignment.description || "";

  document.getElementById(
    "assignmentRequirements"
  ).value =
    assignment.requirements || "";

  if (assignment.deadline) {

    document.getElementById(
      "assignmentDeadline"
    ).value =
      assignment.deadline
        .replace(" ", "T");
  }
}

// ================= UPDATE =================
async function updateAssignment() {

  try {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const id =
      params.get("id");

    const title =
      document.getElementById(
        "assignmentTitle"
      ).value;

    const description =
      document.getElementById(
        "assignmentDescription"
      ).value;

    const requirements =
      document.getElementById(
        "assignmentRequirements"
      ).value;

    const deadline =
      document.getElementById(
        "assignmentDeadline"
      ).value;

    const fileInput =
      document.getElementById(
        "assignmentFile"
      );

    // =====================
    // FORM DATA
    // =====================

    const formData =
      new FormData();

    formData.append("title", title);

    formData.append(
      "description",
      description
    );

    formData.append(
      "requirements",
      requirements
    );

    formData.append(
      "deadline",
      deadline
    );

    // =====================
    // NEW FILES
    // =====================

    if (fileInput.files.length > 0) {

      Array.from(fileInput.files)
        .forEach(file => {

          formData.append(
            "files",
            file
          );
        });
    }

    const res = await fetch(
      `http://localhost:8080/assignments/${id}`,
      {
        method: "PUT",

        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem(
              "idToken"
            )
        },

        body: formData
      }
    );

    if (!res.ok) {

      throw new Error(
        "Update failed"
      );
    }

    alert("แก้ไขสำเร็จ");

    window.location.href =
      `create_assignments_all.html?courseId=${courseId}`;

  } catch (err) {

    console.error(err);

    alert("แก้ไขไม่สำเร็จ");
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


// ================= GO TO EDIT =================

function goToEdit(id) {

	window.location.href =
	   `edit_assignment.html?id=${id}&courseId=${courseId}`;
}


//loadAssignmentData();

