// select all checkbox
const selectAll = document.querySelector('.course-header input');
const checkboxes = document.querySelectorAll('.course-row input');

if (selectAll) {
  selectAll.addEventListener('change', () => {
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
  });
}