const API_URL = "http://localhost:8080/assignments";

async function loadAssignmentDetail() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const assignmentId = urlParams.get('id');

        if (!assignmentId) {
            console.error("Assignment ID not found");
            return;
        }

        const response = await fetch(`${API_URL}/${assignmentId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const assignment = await response.json();
        console.log("Assignment loaded:", assignment);

        // เช็ค element ก่อน
        const titleEl = document.getElementById("assignmentTitle");
        const descEl = document.getElementById("assignmentDescription");    // แก้
        const reqEl = document.getElementById("assignmentRequirements");    // แก้
        const dateEl = document.getElementById("assignmentDueDate");        // แก้
        const timeEl = document.getElementById("assignmentTimeRemaining");  // แก้

        // อัปเดต Title
        if (titleEl) titleEl.textContent = assignment.title || "Untitled";

        // อัปเดต Description
        if (descEl) descEl.textContent = (assignment.description && assignment.description !== "--") ? assignment.description : "No description";

        // อัปเดต Requirements
        if (reqEl) {
            if (assignment.requirements) {
                const reqList = assignment.requirements.split('\n').filter(r => r.trim());
                if (reqList.length > 1) {
                    reqEl.innerHTML = reqList.map(r => `• ${r}`).join('<br>');
                } else {
                    reqEl.textContent = (assignment.requirements && assignment.requirements !== "--") ? assignment.requirements : "No requirements";
                }
            } else {
                reqEl.textContent = "No requirements";
            }
        }

        // อัปเดต Due Date
        if (dateEl) {
            if (assignment.deadline) {
                const deadline = new Date(assignment.deadline);
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                dateEl.textContent = deadline.toLocaleDateString('en-US', options);
            } else {
                dateEl.textContent = "No deadline set";
            }
        }

        // คำนวณเวลาที่เหลือ
        if (timeEl && assignment.deadline) {
            const today = new Date();
            const dueDate = new Date(assignment.deadline);
            const timeDiff = dueDate - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            if (daysLeft > 0) {
                timeEl.textContent = daysLeft + " day" + (daysLeft > 1 ? "s" : "");
            } else if (daysLeft === 0) {
                timeEl.textContent = "Due today";
            } else {
                timeEl.textContent = "Overdue";
            }
        }

    } catch (error) {
        console.error("Error loading assignment:", error);
    }
}

// Event listeners - เรียกหลัง DOM load เสร็จ
document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูล assignment
    loadAssignmentDetail();

    // File upload handler
    const fileBtn = document.getElementById("fileBtn");
    const fileInput = document.getElementById("fileInput");
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const fileName = document.getElementById("fileName");

    if (fileBtn) {
        fileBtn.addEventListener("click", () => {
            if (fileInput) fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file && fileName) {
                fileName.textContent = "File: " + file.name;
            }
        });
    }

    if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        const file = fileInput?.files[0];
        if (!file) {
            alert("Please select a file to submit");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const assignmentId = urlParams.get('id');

        const token = localStorage.getItem("accessToken"); // ดึง token

        const formData = new FormData();
        formData.append("file", file);
        formData.append("assignmentId", assignmentId);

        try {
            const response = await fetch("http://localhost:8080/submissions/upload", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            // เปลี่ยน badge เป็นสีเขียว
            const badge = document.querySelector(".status-badge");
            if (badge) {
                badge.textContent = "SUBMITTED";
                badge.style.backgroundColor = "#4CAF50";
                badge.style.color = "white";
            }

            alert("Submitted successfully!");

        } catch (error) {
            console.error("Submit error:", error);
            alert("Submission failed: " + error.message);
        }
		
		window.location.href =
		    "/HTML/dashboard_student.html";
    });
}

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.history.back();
        });
    }
});