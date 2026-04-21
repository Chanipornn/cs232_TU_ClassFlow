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


// ======= SAVE ANNOUNCEMENT + ADD ASSIGNMENT =======
function saveAnnouncement() {
  const title  = document.getElementById('annTitle').value.trim();
  const date   = document.getElementById('annDate').value;
  const msg    = document.getElementById('annMessage').value.trim();
  const courseCode = document.getElementById('annCourse').value;

  if (!title) {
    alert('Please enter a title.');
    return;
  }

  const dateStr = date
    ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  // ===== โหลด courses =====
  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  let course = courses.find(c => c.code === courseCode);

  if (course) {
    if (!course.assignments) {
      course.assignments = [];
    }

    if (date && !course.assignments.some(a => a.title === title && a.dueDate === date)) {
      course.assignments.push({
        title: title,
        dueDate: date
      });
    }

    localStorage.setItem("courses", JSON.stringify(courses));
  }

  // ===== UI =====
  if (editingAnnEl) {
    editingAnnEl.querySelector('.announcement-info').innerHTML =
      `<b>📢 ${title}</b><br>
       Course: ${courseCode}<br>
       Instructor: Prapaporn Rattamrong<br>
       Date: ${dateStr}<br>
       ${msg}`;
  } else {
    const list = document.getElementById('announcementList');

    const div = document.createElement('div');
    div.className = 'announcement';

    div.innerHTML = `
      <div class="announcement-info">
        <b>📢 ${title}</b><br>
        Course: ${courseCode}<br>
        Instructor: Prapaporn Rattamrong<br>
        Date: ${dateStr}<br>
        ${msg}
      </div>
      <div class="ann-actions">
        <button onclick="openEditModal(this)">Edit</button>
        <button onclick="deleteAnnouncement(this)">Delete</button>
      </div>
    `;

    list.prepend(div);
  }

  closeModal();
}


// ======= DELETE =======
let deletingAnnEl = null;

function deleteAnnouncement(btn) {
  deletingAnnEl = btn.closest('.announcement');
  document.getElementById('deleteModal').classList.add('active');
}

function confirmDelete() {
  if (deletingAnnEl) {
    deletingAnnEl.remove();
    deletingAnnEl = null;
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
  document.getElementById('courseInstructor').value = '';
}

function closeCourseModal() {
  document.getElementById('courseModal').classList.remove('active');
}


// ======= CREATE COURSE =======
function createCourse() {
  const name = document.getElementById('courseName').value.trim();
  const code = document.getElementById('courseCode').value.trim();
  const instructor = document.getElementById('courseInstructor').value.trim();

  if (!name || !code) {
    alert("Please fill Course Name and Code");
    return;
  }

  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  if (courses.some(c => c.code === code)) {
    alert("Course already exists!");
    return;
  }

  const newCourse = {
    name,
    code,
    instructor,
    assignments: []
  };

  courses.push(newCourse);

  localStorage.setItem("courses", JSON.stringify(courses));

  // 🔥 trigger ให้ student รู้ (optional)
  localStorage.setItem("courses_updated", Date.now());

  // ===== UI =====
  const list = document.getElementById('courseList');

  const div = document.createElement('div');
  div.className = 'course-card';
  div.innerHTML = `
    <b>${code} ${name}</b><br>
    Instructor: ${instructor}<br>
    Assignments: 0<br>
    Next Deadline: -
  `;

  list.prepend(div);

  closeCourseModal();
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