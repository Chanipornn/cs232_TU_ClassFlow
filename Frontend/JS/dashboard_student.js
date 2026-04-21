document.addEventListener('DOMContentLoaded', function () {

  // ===== LOAD DATA =====
  const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
  const allCourses = JSON.parse(localStorage.getItem("courses")) || [];

  // ===== BUILD CALENDAR EVENTS FROM ASSIGNMENTS =====
  let events = [];

  enrolled.forEach(enrollCourse => {
    const fullCourse = allCourses.find(c => c.code === enrollCourse.code);

    if (fullCourse && fullCourse.assignments) {
      fullCourse.assignments.forEach(a => {
        events.push({
          title: a.title,
          date: a.dueDate
        });
      });
    }
  });

  // ===== CALENDAR =====
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: events,

    dateClick: function(info) {
      alert("Clicked: " + info.dateStr);
    }
  });

  calendar.render();


  // ===== MY COURSES =====
  const container = document.getElementById("myCoursesContainer");

  // ถ้าไม่มีวิชา
  if (enrolled.length === 0) {
    container.innerHTML = "<p style='padding:20px;'>No enrolled courses yet.</p>";
    return;
  }

  // แสดงวิชา
  enrolled.forEach(c => {
    const div = document.createElement("div");
    div.className = "course-card";

    div.innerHTML = `
      <b>${c.code} ${c.name}</b><br>
      Instructor: ${c.instructor}<br>
      Assignments: ${c.assignments ? c.assignments.length : 0}<br>
      Next Deadline: -
    `;

    container.appendChild(div);
  });

});