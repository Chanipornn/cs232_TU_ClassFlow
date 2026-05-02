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