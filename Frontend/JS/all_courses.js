// select all checkbox
const selectAll = document.querySelector('.course-header input');
const checkboxes = document.querySelectorAll('.course-row input');

if (selectAll) {
  selectAll.addEventListener('change', () => {
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector(".course-list");

  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  list.innerHTML = "";

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

// ===== ENROLL =====
function enrollSelected() {
  const checkboxes = document.querySelectorAll(".course-checkbox:checked");

  let courses = JSON.parse(localStorage.getItem("courses")) || [];
  let enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

  checkboxes.forEach(cb => {
    const course = courses[cb.dataset.index];

    // กันซ้ำ
    if (!enrolled.some(c => c.code === course.code)) {
      enrolled.push(course);
    }
  });

  localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));

  alert("Enrolled successfully!");
}