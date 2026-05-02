const API_BASE_URL = window.ASSIGNMENT_API_BASE_URL || 'http://localhost:8080/api';

const PAGE_MODE = (() => {
  const fileName = window.location.pathname.split('/').pop() || '';

  if (fileName.includes('active')) return 'active';
  if (fileName.includes('closed')) return 'closed';
  return 'all';
})();

let allAssignments = [];

window.addEventListener('DOMContentLoaded', async () => {
  setupAccordions();
  setupProfileButton();
  setupSearch();
  setupSaveButton();

  if (document.getElementById('assignmentList')) {
    await loadAssignments();
  }

  if (window.location.pathname.includes('create_assignment_form.html')) {
    await loadAssignmentForEdit();
  }
});

async function loadAssignments() {
  const list = document.getElementById('assignmentList');
  const countEl = document.getElementById('assignmentCount');

  if (!list) return;

  showLoading(list);

  try {
    const assignments = await fetchAssignments();
    allAssignments = filterAssignmentsByPage(assignments, PAGE_MODE);

    if (countEl) {
      countEl.textContent = allAssignments.length;
    }

    renderAssignments(allAssignments);
  } catch (error) {
    console.error(error);
    list.innerHTML = `
      <div class="empty-state">
        <h3>โหลดข้อมูลงานไม่สำเร็จ</h3>
        <p>ตรวจสอบว่า backend ทำงานอยู่ และ API path ถูกต้อง</p>
        <p class="error-hint">${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

async function fetchAssignments() {
  const response = await fetch(`${API_BASE_URL}/assignments`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;

  return [];
}

function filterAssignmentsByPage(assignments, mode) {
  if (mode === 'active') {
    return assignments.filter((item) => normalizeStatus(item.status) === 'active');
  }

  if (mode === 'closed') {
    return assignments.filter((item) => normalizeStatus(item.status) === 'closed');
  }

  return assignments;
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase().trim();

    const filtered = allAssignments.filter((item) => {
      const title = String(item.title || '').toLowerCase();
      const description = String(item.description || '').toLowerCase();

      return title.includes(keyword) || description.includes(keyword);
    });

    renderAssignments(filtered);
  });
}

function renderAssignments(assignments) {
  const list = document.getElementById('assignmentList');
  if (!list) return;

  if (assignments.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>ไม่พบข้อมูลงาน</h3>
        <p>ยังไม่มี assignment ในสถานะนี้ หรือไม่พบคำค้นหา</p>
      </div>
    `;
    return;
  }

  list.innerHTML = assignments.map(createAssignmentCard).join('');
  bindDeleteButtons();
}

function createAssignmentCard(item) {
  const id = item.id ?? '';
  const title = item.title || 'Untitled Assignment';
  const description = item.description || '-';
  const status = normalizeStatus(item.status);

  const totalStudents = Number(item.totalStudents ?? item.total_students ?? 0);
  const submittedCount = Number(item.submittedCount ?? item.submitted_count ?? 0);
  const notSubmittedCount = Number(
    item.notSubmittedCount ??
    item.not_submitted_count ??
    Math.max(totalStudents - submittedCount, 0)
  );

  const deadline = formatDate(item.deadline || item.dueDate || item.due_date);
  const badgeClass = status === 'closed' ? 'closed-status' : 'active-status';
  const badgeText = status === 'closed' ? 'Closed' : 'Active';
  const editHref = `create_assignment_form.html${id ? `?id=${encodeURIComponent(id)}` : ''}`;
  const detailHref = `create_assignment_detail.html${id ? `?id=${encodeURIComponent(id)}` : ''}`;

  return `
    <article class="assignment-card" data-id="${escapeHtml(String(id))}">
      <div class="assignment-main">
        <div class="assignment-info">
          <h2>${escapeHtml(title)}</h2>
          <p class="deadline-text">Deadline: ${escapeHtml(deadline)}</p>
          <p>${escapeHtml(description)}</p>
          <p>${submittedCount} ส่งแล้ว / ${notSubmittedCount} ยังไม่ส่ง</p>
        </div>

        <div class="assignment-side">
          <span class="status-badge ${badgeClass}">${badgeText}</span>

          <div class="action-row">
            <a href="${editHref}" class="small-btn edit-btn">Edit</a>
            <button class="small-btn delete-btn" type="button" data-id="${escapeHtml(String(id))}">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <a href="${detailHref}" class="view-btn">View Submissions</a>
      </div>
    </article>
  `;
}

function bindDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', async function () {
      const assignmentId = this.dataset.id;
      const confirmDelete = confirm('Are you sure you want to delete this assignment?');

      if (!confirmDelete || !assignmentId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`Delete failed: HTTP ${response.status}`);
        }

        allAssignments = allAssignments.filter(
          (item) => String(item.id) !== String(assignmentId)
        );

        renderAssignments(allAssignments);

        const countEl = document.getElementById('assignmentCount');
        if (countEl) {
          countEl.textContent = allAssignments.length;
        }
      } catch (error) {
        console.error(error);
        alert('ลบข้อมูลไม่สำเร็จ');
      }
    });
  });
}

async function loadAssignmentForEdit() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) return;

  try {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Load failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    fillAssignmentForm(data);
  } catch (error) {
    console.error(error);
    alert('โหลดข้อมูลสำหรับแก้ไขไม่สำเร็จ');
  }
}

function fillAssignmentForm(data) {
  const titleInput = document.getElementById('assignmentTitle');
  const descriptionInput = document.getElementById('assignmentDescription');
  const deadlineInput = document.getElementById('assignmentDeadline');
  const statusInput = document.getElementById('assignmentStatus');

  if (titleInput) titleInput.value = data.title || '';
  if (descriptionInput) descriptionInput.value = data.description || '';

  if (deadlineInput) {
    deadlineInput.value = toDateTimeLocalValue(data.deadline || data.dueDate || data.due_date);
  }

  if (statusInput) {
    statusInput.value = normalizeStatus(data.status);
  }
}

function setupSaveButton() {
  const saveBtn = document.getElementById('saveAssignmentBtn');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const payload = collectAssignmentFormData();
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const isEditMode = Boolean(id);
    const requestUrl = isEditMode
      ? `${API_BASE_URL}/assignments/${id}`
      : `${API_BASE_URL}/assignments`;

    const requestMethod = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Save failed: HTTP ${response.status}`);
      }

      alert(isEditMode ? 'Updated successfully' : 'Created successfully');
      window.location.href = 'create_assignments_all.html';
    } catch (error) {
      console.error(error);
      alert('บันทึกข้อมูลไม่สำเร็จ');
    }
  });
}

function collectAssignmentFormData() {
  return {
    title: document.getElementById('assignmentTitle')?.value?.trim() || '',
    description: document.getElementById('assignmentDescription')?.value?.trim() || '',
    deadline: document.getElementById('assignmentDeadline')?.value || null,
    status: document.getElementById('assignmentStatus')?.value || 'active'
  };
}

function setupAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', function () {
      const card = this.parentElement;
      card.classList.toggle('open');
    });
  });
}

function setupProfileButton() {
  const profileBtn = document.querySelector('.profile-btn');
  if (!profileBtn) return;

  profileBtn.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Profile page not connected yet');
  });
}

function showLoading(list) {
  list.innerHTML = `
    <div class="empty-state">
      <h3>Loading assignments...</h3>
      <p>กำลังดึงข้อมูลจากฐานข้อมูล</p>
    </div>
  `;
}

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase().trim();
  return value === 'closed' ? 'closed' : 'active';
}

function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function toDateTimeLocalValue(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}