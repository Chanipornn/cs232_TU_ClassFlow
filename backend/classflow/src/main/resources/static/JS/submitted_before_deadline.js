const API_BASE = "http://localhost:8080";

async function loadPendingSubmission() {
    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = urlParams.get('id');
    const studentCode = localStorage.getItem("studentId");
    const token = localStorage.getItem("accessToken") || localStorage.getItem("idToken");

    if (!assignmentId) {
        console.error("No assignment ID");
        return;
    }

    const options = {
        headers: { 'Authorization': `Bearer ${token}` }
    };

    try {
        // 1. ดึงข้อมูลตัวงาน (Assignment)
        const assignRes = await fetch(`${API_BASE}/assignments/${assignmentId}`, options);
        if (!assignRes.ok) throw new Error("Failed to fetch assignment");
        const assignment = await assignRes.json();

        // 2. ดึงข้อมูลการส่งงาน (Submission)
        const subRes = await fetch(`${API_BASE}/submissions/assignment/${assignmentId}`, options);
        let mySubmission = null;
        if (subRes.ok) {
            const submissions = await subRes.json();
            // หาข้อมูลการส่งงานของตัวเองจาก studentCode
            mySubmission = submissions.find(s => s.studentCode === studentCode);
        }

        renderPendingPage(assignment, mySubmission);

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('assignment-detail-container').innerHTML = `<p style="color:red">Error loading data</p>`;
    }
}

function renderPendingPage(assignment, submission) {
    // 1. จัดการหัวข้อ
    document.getElementById('assign-title').innerText = assignment.title || "Untitled Assignment";

    // 2. จัดรูปแบบวันที่
    const deadlineStr = assignment.deadline ? new Date(assignment.deadline).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : "No deadline";
    const submitDateStr = submission && submission.submittedAt ? new Date(submission.submittedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : "-";

    // 3. แสดง Description และ Requirements
    const detailContainer = document.getElementById('assignment-detail-container');
    detailContainer.innerHTML = `
        <p><strong>Description:</strong></p>
        <p>${assignment.description || "-"}</p>
        <br>
        <p><strong>Requirements:</strong></p>
        <p>${assignment.requirements || "-"}</p>
    `;

    // 4. แสดงข้อมูลในตาราง Submission
    document.getElementById('sub-status').innerText = "Submitted for grading";
    document.getElementById('sub-due-date').innerText = deadlineStr;
    document.getElementById('sub-grading').innerText = "Not graded"; // ยังไม่ตรวจ
    
    // จัดการเรื่องไฟล์
    if (submission && submission.fileUrl) {
        document.getElementById('sub-file').innerHTML = `<a href="${submission.fileUrl}" target="_blank" class="file-link">${submission.fileName || "View File"}</a> <br><small style="color:gray;">(Submitted at: ${submitDateStr})</small>`;
    } else {
        document.getElementById('sub-file').innerText = "No file attached";
    }

    // 5. จัดการปุ่ม Edit (แนบ ID ไปด้วยเผื่อกดแก้ไข)
    const editBtn = document.getElementById('edit-link');
    if (editBtn) {
        editBtn.href = `edit_submission.html?id=${assignment.id}`;
    }
}

document.addEventListener('DOMContentLoaded', loadPendingSubmission);