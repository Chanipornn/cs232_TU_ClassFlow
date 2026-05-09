// ======= CALENDAR =======
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    height: 240,
    fixedWeekCount: false
  });

  calendar.render();
});


// ======= MODAL =======
let editingAnnEl = null;

function openCreateModal() {
  editingAnnEl = null;
  document.getElementById('modalTitle').textContent = 'Create Announcement';
  document.getElementById('annTitle').value = '';
  document.getElementById('annDate').value = '';
  document.getElementById('annMessage').value = '';
  document.getElementById('modalSaveBtn').textContent = 'Create';
  document.getElementById('annModal').classList.add('active');
}

function openEditModal(btn) {
  editingAnnEl = btn.closest('.announcement');
  const info = editingAnnEl.querySelector('.announcement-info');
  const lines = info.innerText.split('\n');

  document.getElementById('modalTitle').textContent = 'Edit Announcement';
  document.getElementById('annTitle').value = lines[0].replace('📢 ', '').trim();
  document.getElementById('annDate').value = '';
  document.getElementById('annMessage').value = lines[3] ? lines[3].trim() : '';
  document.getElementById('modalSaveBtn').textContent = 'Save';

  document.getElementById('annModal').classList.add('active');
}

function closeModal() {
  document.getElementById('annModal').classList.remove('active');
}

// ===== โหลด courses =====
    const API_URL = "http://localhost:8080";

    function getToken() {
      return localStorage.getItem("idToken");
    }

	// ======= USERNAME =======
	function formatNameFromEmail(email) {
	  if (!email) return "User";

	  const namePart = email.split("@")[0]; // chayananmariwan
	  let parts = namePart.split(/[._]/);

	  if (parts.length === 1) {
	    parts = namePart.match(/[A-Z]?[a-z]+/g) || [namePart];
	  }

	  return parts
	    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
	    .join(" ");
	}

	function setUserNameFromToken() {
	  const token = localStorage.getItem("idToken");
	  if (!token) return;

	  const payload = JSON.parse(atob(token.split(".")[1]));
	  const email = payload.email;

	  const name = formatNameFromEmail(email);

	  document.getElementById("username").innerText = name;
	}
	window.onload = function () {
    console.log("onload fired");
	  setUserNameFromToken();
	  loadCourses(); 
    loadAnnouncements();  
	};
	
	
// ===== CREATE COURSE (BACKEND) =====
async function createCourse() {
  const name = document.getElementById('courseName').value.trim();
  const code = document.getElementById('courseCode').value.trim();
  const section = document.getElementById('courseSection').value.trim();
  const description = document.getElementById('courseDesc').value.trim();

  if (!name || !code) {
    alert("Please fill Course Name and Code");
    return;
  }

  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
     /* body: JSON.stringify({
        code: code,           // ✅ เพิ่ม
        name: name,           // ✅ ไม่ต้อง concat แล้ว
        section: section,     // ✅ เพิ่ม
        description: description
      })*/
	  
	  body: JSON.stringify({
	    courseCode: code,
	    title: name,
	    section: section,
	    description: description
	  })
    });

    const course = await res.json();

    renderCourse(course);
    closeCourseModal();

  } catch (err) {
    console.error(err);
  }
}
	  
	  
  // ===== RENDER =====
  function renderCourse(course) {

    const list = document.getElementById('courseList');

    const div = document.createElement('div');

    div.className = 'course-card';
	
    div.innerHTML = `
      <div class="course-title">
        ${course.courseCode || course.code}
        -
        ${course.title || course.name}

        <span class="section">
          Sec ${course.section || "-"}
        </span>
      </div>

      <div class="course-desc">
        ${course.description || "-"}
      </div>

      <div class="course-instructor">
        Instructor:
        ${course.instructor?.email || "Unknown"}
      </div>
    `;

    div.style.cursor = "pointer";

    div.onclick = () => {
      window.location.href =
        `/HTML/create_assignments_all.html?courseId=${course.id}`;
    };

    list.prepend(div);
  }
  
  
// ===== LOAD COURSE =====
async function loadCourses() {
	const token = getToken();

	  const res = await fetch(`${API_URL}/courses/my`, {
	    headers: {
	      "Authorization": `Bearer ${token}`
	    }
	  });

	  console.log("status:", res.status);

	  if (!res.ok) {
	    const text = await res.text();
	    console.error("API ERROR:", text);
	    return;
	  }

	  const text = await res.text();
	  if (!text) {
	    console.warn("Empty response");
	    return;
	  }

	  const courses = JSON.parse(text);

	  const list = document.getElementById("courseList");
	  list.innerHTML = "";

	  courses.forEach(renderCourse);
}


// ======= SAVE ANNOUNCEMENT + ADD ASSIGNMENT =======
async function saveAnnouncement() {
  const title  = document.getElementById('annTitle').value.trim();
  const date   = document.getElementById('annDate').value;
  const msg    = document.getElementById('annMessage').value.trim();
  const courseCode = document.getElementById('annCourse').value;
  const token = getToken();

  try {
        const res = await fetch(`${API_URL}/announcements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, date, message: msg, courseCode })
        });

        const saved = await res.json(); // ได้ id กลับมา

  const dateStr = date
    ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
  
 
    const list = document.getElementById('announcementList');

    const div = document.createElement('div');
    div.className = 'announcement';
    div.dataset.id = saved.id; // เก็บ id ไว้

	div.innerHTML = `
    <div class="announcement-info">
        <b>📢 ${title}</b><br>
        Date: ${dateStr}<br>
        ${msg}
    </div>
    <div class="ann-actions">
        <button class="btn-edit" onclick="openEditModal(this)">Edit</button>
        <button class="btn-delete" onclick="deleteAnnouncement(this)">Delete</button>
    </div>
`;

        list.prepend(div);
        closeModal();

    } catch (err) {
        console.error(err);
    }
}


// ======= LOAD ANNOUNCEMENTS (เพิ่มใหม่) =======
async function loadAnnouncements() {
    const token = getToken();

    try {
        const res = await fetch(`${API_URL}/announcements`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const announcements = await res.json();
        const list = document.getElementById('announcementList');
        list.innerHTML = '';

        announcements.forEach(ann => {
            const div = document.createElement('div');
            div.className = 'announcement';
            div.dataset.id = ann.id;

            div.innerHTML = `
                <div class="announcement-info">
                    <b>📢 ${ann.title}</b><br>
                    Date: ${ann.date || '—'}<br>
                    ${ann.message || ''}
                </div>
                <div class="ann-actions">
                    <button class="btn-edit" onclick="openEditModal(this)">Edit</button>
                    <button class="btn-delete" onclick="deleteAnnouncement(this)">Delete</button>
                </div>
            `;

            list.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

// ======= DELETE =======
let deletingAnnEl = null;

function deleteAnnouncement(btn) {
  deletingAnnEl = btn.closest('.announcement');
  document.getElementById('deleteModal').classList.add('active');
}

async function confirmDelete() {
    if (!deletingAnnEl) return;

    const id = deletingAnnEl.dataset.id; //ดึง id จาก element
    const token = getToken();

    try {
        const res = await fetch(`${API_URL}/announcements/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            deletingAnnEl.remove(); // ลบ DOM หลัง API สำเร็จ
            deletingAnnEl = null;
        } else {
            alert('ลบไม่สำเร็จ');
        }
    } catch (err) {
        console.error(err);
    }

    closeDeleteModal();
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('active');
}


// ======= COURSE MODAL =======
function openCourseModal() {
  document.getElementById('courseModal').classList.add('active');

  document.getElementById('courseName').value = '';
  document.getElementById('courseCode').value = '';
  document.getElementById('courseSection').value = '';
}

function closeCourseModal() {
  document.getElementById('courseModal').classList.remove('active');
}


// ======= CLOSE MODAL =======
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById('deleteModal').addEventListener('click', function (e) {
    if (e.target === this) closeDeleteModal();
  });

  document.getElementById('annModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  document.getElementById('courseModal').addEventListener('click', function (e) {
    if (e.target === this) closeCourseModal();
  });

});

