async function fetchSubmissionAndFeedback() {
    // 1. รับ ID จาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = urlParams.get('id');

    if (!assignmentId) {
        console.error("Assignment ID is missing!");
        return;
    }

    // 2. URL สำหรับ Backend (รอเพื่อนเปิด API)
    const API_URL = `http://localhost:8080/api/submissions/details/${assignmentId}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();

        // 3. แสดงผลข้อมูล
        renderDonePage(data);

    } catch (error) {
        console.error("Error:", error);
        // แสดงกรณีหาข้อมูลไม่พบ
        document.getElementById('assignment-detail-container').innerHTML = 
            `<p style="color:red; text-align:center;">Error: Could not load data.</p>`;
    }
}

function renderDonePage(data) {
    const detailContainer = document.getElementById('assignment-detail-container');
    
    // --- 1. จัดการปุ่มและสีของเวลา (Logic ตามสถานะการส่ง) ---
    let statusClass = "submit-btn"; 
    let statusText = "SUBMITTED FOR GRADING";
    let timeStyle = "";

    if (data.status === 'late') {
        statusClass = "late-btn"; // คลาสปุ่มสีแดง
        statusText = "LATE SUBMITTED"; // หรือ "NOT SUBMITTED" ตามที่คุณต้องการ
        timeStyle = "color: red; font-weight: bold;";
    }

    // --- 2. จัดการคะแนน (Logic ตามเงื่อนไขอาจารย์ตรวจหรือไม่ตรวจ) ---
    // ถ้าสถานะเป็น late และยังไม่มีคะแนน (grade ยังไม่ถูกส่งมา) ให้เซตเป็น 0 ทันที
    let displayGrade = data.grade;
    if (data.status === 'late' && !data.isGraded) {
        displayGrade = "0 / 50.00"; // อาจารย์ยังไม่ตรวจแต่สาย ให้เป็น 0 ไว้ก่อน
    } else if (data.isGraded) {
        displayGrade = data.grade; // ถ้าอาจารย์ตรวจแล้ว ให้ใช้คะแนนตามจริง (แม้จะส่งสายปุ่มก็ยังแดงอยู่)
    }

    // --- 3. แสดงผลลงใน HTML ---
    
    // ส่วนรายละเอียดงาน
    detailContainer.innerHTML = `
        <p><strong>Description</strong></p>
        <p>${data.description}</p>
        <br>
        <p><strong>Time remaining</strong></p>
        <p style="${timeStyle}">${data.timeRemaining}</p>
        <button class="${statusClass}">${statusText}</button>
    `;

    // ส่วนตาราง Feedback
    document.getElementById('fb-grade').innerText = displayGrade;
    document.getElementById('fb-comment').innerText = data.comment || "-";
    document.getElementById('fb-teacher').innerText = data.teacherName || "-";
}

// เริ่มทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', fetchSubmissionAndFeedback);