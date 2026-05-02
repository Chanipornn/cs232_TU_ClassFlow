async function fetchAssignmentDetails() {

    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = urlParams.get('id');

    if (!assignmentId) {
        console.error("No Assignment ID found");
        return;
    }

    const API_URL = `http://localhost:8080/api/assignments/${assignmentId}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Fetch failed");
        
        const data = await response.json();

        renderAssignmentPage(data);

    } catch (error) {
        console.error("Error:", error);
        // แสดงข้อความ Error กรณีหาข้อมูลไม่เจอ
        document.body.innerHTML = `<h2 style="text-align:center; margin-top:50px;">Assignment Not Found</h2>`;
    }
}

// ฟังก์ชันสำหรับใส่ข้อมูลลงใน Element
function renderAssignmentPage(data) {
    // เปลี่ยนหัวข้อหน้าเว็บ
    document.querySelector('.header-info h1').innerText = data.title;
    
    // ใส่ข้อมูลในกล่อง Description
    const descriptionBox = document.querySelector('.submission-box.description-box');
    descriptionBox.innerHTML = `
        <div class="content-group">
            <p><strong>Description</strong></p>
            <p>${data.description}</p>
        </div>
        <div class="content-group">
            <p><strong>Requirements</strong></p>
            <ul>
                ${data.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>
        <div class="content-group">
            <p><strong>Due Date</strong></p>
            <p>${data.dueDate}</p>
        </div>
        <div class="content-group">
            <p><strong>Time remaining</strong></p>
            <p>${data.timeRemaining}</p>
        </div>
        <button class="status-badge">${data.submissionStatus.toUpperCase()}</button>
    `;

    // ใส่ข้อมูลในตาราง Submission
    document.getElementById('sub-status').innerText = data.submissionStatus;
    document.getElementById('sub-due-date').innerText = data.fullDueDate;
    document.getElementById('sub-grading').innerText = data.gradingStatus;
    
    if (data.submittedFile) {
        document.getElementById('sub-file').innerHTML = `<a href="${data.fileUrl}" class="file-link">${data.submittedFile}</a>`;
    }

    // ปุ่ม Edit
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        const urlParams = new URLSearchParams(window.location.search);
        const assignmentId = urlParams.get('id');
        editBtn.href = `edit_submission.html?id=${assignmentId}`;
    }
}

document.addEventListener('DOMContentLoaded', fetchAssignmentDetails);