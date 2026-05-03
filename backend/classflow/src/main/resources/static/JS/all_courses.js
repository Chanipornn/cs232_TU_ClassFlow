document.addEventListener("DOMContentLoaded", function () {

  const list = document.querySelector(".course-list");
  const selectAll = document.querySelector(".course-header input");

  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  console.log("Courses:", courses);

  list.innerHTML = "";

  // ===== RENDER COURSES =====
  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course-card";

    div.innerHTML = `
      <h3>${course.code} - ${course.name} (Sec ${course.section || "-"})</h3>
      <p>Description: ${course.description || "-"}</p>
    `;

    // ✅ ใช้ course ตรงนี้ (อยู่ใน scope)
    div.onclick = () => goToCourse(course.id);

    list.appendChild(div);
  });
  /*
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
*/
function goToCourse(courseId) {
  console.log("CLICK COURSE ID:", courseId);
  window.location.href = `create_assignments_all.html?courseId=${courseId}`;
}
  // ===== SELECT ALL =====
  if (selectAll) {
    selectAll.addEventListener("change", () => {
      document.querySelectorAll(".course-checkbox")
        .forEach(cb => cb.checked = selectAll.checked);
    });
  }

});


// ===== ENROLL =====
function enrollSelected() {

  const checked = document.querySelectorAll(".course-checkbox:checked");

  if (checked.length === 0) {
    alert("Please select at least one course");
    return;
  }

  let courses = JSON.parse(localStorage.getItem("courses")) || [];
  let enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

  checked.forEach(cb => {
    const course = courses[cb.dataset.index];

    if (!course) return;

    if (!enrolled.some(c => c.code === course.code)) {
      enrolled.push(course);
    }
  });

  localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));

  alert("Enrolled successfully!");


  localStorage.setItem("enroll_updated", Date.now());

  window.location.href = "dashboard_student.html";
}