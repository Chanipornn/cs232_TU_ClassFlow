const API_BASE = "http://localhost:8080";

// ดึง Elements จาก HTML
const fileInput = document.getElementById("fileInput");
const fileNameEl = document.getElementById("fileName");
const fileDateEl = document.getElementById("fileDate");
const fileSizeEl = document.getElementById("fileSize");
const fileTypeEl = document.getElementById("fileType");
const deleteBtn = document.getElementById("deleteBtn");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const fileBtn = document.getElementById("fileBtn");

// เก็บไฟล์ที่เลือกใหม่
let selectedFile = null;

// ดึง IDs จาก URL
const urlParams = new URLSearchParams(window.location.search);
const assignmentId = urlParams.get('id');
const courseId = urlParams.get('courseId');

// 1. โหลดข้อมูล Assignment เพื่อมาแสดงรายละเอียดบนหน้าเว็บ
async function loadAssignmentInfo() {
    try {
        const response = await fetch(`${API_BASE}/assignments/${assignmentId}`);
        const data = await response.json();
        // อัปเดต UI รายละเอียดงาน (ถ้ามี ID ตรงกับ HTML)
        if(document.querySelector(".assignment-card h1")) {
            document.querySelector(".assignment-card h1").innerText = data.title;
        }
    } catch (error) {
        console.error("Error loading assignment:", error);
    }
}

// 2. จัดการเมื่อมีการเลือกไฟล์ใหม่
fileBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        // แสดงข้อมูลไฟล์บนตาราง
        fileNameEl.textContent = file.name;
        fileDateEl.textContent = new Date().toLocaleDateString();
        fileSizeEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        fileTypeEl.textContent = file.type || "Unknown";
        
        // เปลี่ยน UI เป็นสถานะพร้อมส่ง
        document.getElementById("fileRow").style.display = "flex";
        document.getElementById("emptyState").style.display = "none";
    }
});

// 3. ลบไฟล์ที่เลือก (ล้างค่าในหน้าจอ)
deleteBtn.addEventListener("click", () => {
    selectedFile = null;
    fileInput.value = "";
    fileNameEl.textContent = "No file selected";
    fileDateEl.textContent = "-";
    fileSizeEl.textContent = "-";
    fileTypeEl.textContent = "-";
});

// 4. บันทึกการเปลี่ยนแปลง (Save Changes) - ส่งไปยัง Backend
submitBtn.addEventListener("click", async () => {
    if (!selectedFile) {
        alert("Please select a new file to upload");
        return;
    }

    const token = localStorage.getItem("accessToken") || localStorage.getItem("idToken");
    const studentCode = localStorage.getItem("studentId");
    const studentName = localStorage.getItem("fullName");

    // เตรียม FormData เหมือนหน้า assignment_detail
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("assignmentId", assignmentId);
    formData.append("studentCode", studentCode);
    formData.append("studentName", studentName);

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Saving...";

        const response = await fetch(`${API_BASE}/submissions/upload`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (!response.ok) throw new Error("Upload failed");

        alert("Changes saved successfully!");
        // เมื่อสำเร็จ ให้ไปที่หน้า Submitted_before_deadline พร้อมส่ง ID งานไปด้วย
        window.location.href = `Submitted_before_deadline.html?id=${assignmentId}&courseId=${courseId}`;

    } catch (error) {
        console.error("Error saving changes:", error);
        alert("Failed to save changes: " + error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Save changes";
    }
});

cancelBtn.addEventListener("click", () => {
    window.history.back();
});

// เรียกทำงานเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", loadAssignmentInfo);