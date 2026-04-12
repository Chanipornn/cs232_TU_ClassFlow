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
  
  function saveAnnouncement() {
    const title = document.getElementById('annTitle').value.trim();
    const date  = document.getElementById('annDate').value;
    const msg   = document.getElementById('annMessage').value.trim();
  
    if (!title) { alert('Please enter a title.'); return; }
  
    const dateStr = date
      ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—';
  
    if (editingAnnEl) {
      // UPDATE
      editingAnnEl.querySelector('.announcement-info').innerHTML =
        `<b>📢 ${title}</b><br>
         Instructor: Prapaporn Rattamrong...<br>
         Date: ${dateStr}<br>
         ${msg}`;
    } else {
      // CREATE
      const list = document.getElementById('announcementList');
      const div = document.createElement('div');
      div.className = 'announcement';
      div.innerHTML = `
        <div class="announcement-info">
          <b>📢 ${title}</b><br>
          Instructor: Prapaporn Rattamrong...<br>
          Date: ${dateStr}<br>
          ${msg}
        </div>
        <div class="ann-actions">
          <button class="btn-edit" onclick="openEditModal(this)">Edit</button>
          <button class="btn-delete" onclick="deleteAnnouncement(this)">Delete</button>
        </div>`;
      list.prepend(div);
    }
  
    closeModal();
  }
  
  function deleteAnnouncement(btn) {
    if (confirm('Delete this announcement?')) {
      btn.closest('.announcement').remove();
    }
  }
  
  // ปิด modal เมื่อคลิก overlay
  document.getElementById('annModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });