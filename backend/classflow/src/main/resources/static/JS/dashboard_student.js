document.addEventListener("DOMContentLoaded", function () {

  const list = document.querySelector(".course-list");

  // 🔥 กัน error ถ้าไม่ได้อยู่หน้า all_courses
  if (!list) return;

  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  list.innerHTML = "";

  // 🔥 ถ้าไม่มี course
  if (courses.length === 0) {
    list.innerHTML = "<p>No courses available</p>";
    return;
  }

  courses.forEach((c, index) => {
    const row = document.createElement("div");
    row.className = "course-row";

    row.innerHTML = `
      <input type="checkbox" class="course-checkbox" data-index="${index}">
      <div class="course-card">
        <b>${c.code} ${c.name}</b><br>
        Instructor: ${c.instructor}
      </div>
    `;

    list.appendChild(row);
  });

});


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

// ===== ENROLL =====
function enrollSelected() {
  const checkboxes = document.querySelectorAll(".course-checkbox:checked");

  let courses = JSON.parse(localStorage.getItem("courses")) || [];
  let enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];


  if (checkboxes.length === 0) {
    alert("Please select at least 1 course");
    return;
  }

  checkboxes.forEach(cb => {
    const course = courses[cb.dataset.index];

    // กัน undefined
    if (!course) return;

    // กันซ้ำ
    if (!enrolled.some(c => c.code === course.code)) {
      enrolled.push(course);
    }
  });

  localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));

  alert("Enrolled successfully!");

  // ไป dashboard (calendar จะไม่พังเพราะแยก JS แล้ว)
  window.location.href = "dashboard_student.html";
}


// ===== NAVIGATION =====
function goToAllCourses() {
  window.location.href = "all_courses.html";
}

// ===== API WITH TOKEN =====
const API_URL = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("idToken");
}

// ===== LOAD COURSE =====
async function loadMyCourses() {
	try {
	   const token = getToken();

	   const res = await fetch(`${API_URL}/courses/my`, {
	     headers: {
	       "Authorization": `Bearer ${token}`
	     }
	   });

	   const data = await res.json();

	   console.log("API response:", data);

	   if (!Array.isArray(data)) {
	     console.error("Not array:", data);
	     return;
	   }

	   renderCourses(data);

	 } catch (err) {
	   console.error(err);
	 }
}

// ===== RENDER =====
function renderCourses(courses) {
  const container = document.getElementById("myCoursesContainer");
  container.innerHTML = "";

  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course-card";

    div.innerHTML = `
      <h3>${course.name}</h3>
      <p>${course.description || ""}</p>
      <button onclick="viewAssignments(${course.id})">
        View Assignments
      </button>
    `;

    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadMyCourses();
});


async function viewAssignments(courseId) {
  const token = getToken();

  const res = await fetch(`${API_URL}/assignments/course/${courseId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const assignments = await res.json();

  alert(JSON.stringify(assignments, null, 2));
}