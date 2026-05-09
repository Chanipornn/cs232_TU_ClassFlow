let allSubmissions = []; 

document.addEventListener('DOMContentLoaded', () => {
	setupBackButton();
    fetchSubmissions();
    setupEventListeners();
	loadAssignmentInfo();
});

async function fetchSubmissions() {
    //const API_URL = 'http://localhost:8080/api/submissions'; 
	const params = new URLSearchParams(window.location.search);

	const assignmentId = params.get("assignmentId");
	const courseId = params.get("courseId");

	const API_URL =
	  `http://localhost:8080/submissions/assignment/${assignmentId}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
        
        allSubmissions = await response.json(); 
        
        renderTable(allSubmissions);
        updateStatCards(allSubmissions);
		
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('submission-list').innerHTML = 
            '<tr><td colspan="4" style="text-align:center;">กรุณารอการเชื่อมต่อข้อมูลจากระบบ...</td></tr>';
    }
}

function filterData(status) {
    let filtered;
    if (status === 'all') {
        filtered = allSubmissions;
    } else if (status === 'on-time') {
        filtered = allSubmissions.filter(i => !i.late);
    } else if (status === 'late') {
        filtered = allSubmissions.filter(i => i.late);
    }
    renderTable(filtered);
}

/*
function renderTable(data) {
    const tableBody = document.getElementById('submission-list');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const isLate = (item.isLate === true || item.isLate === "true");
        const dateClass = isLate ? 'late-text' : '';

        const row = `
            <tr>
                <td>${item.id}</td>
                <td>
                    <a href="assignment_detail_instructor.html?studentId=${item.id}" style="text-decoration: none; color: inherit;">
                        ${item.studentName || "-"}
                    </a>
                </td>
                <td class="${dateClass}">				${
				    item.submittedAt
				    ? new Date(item.submittedAt).toLocaleString()
				    : "-"
				}</td>
                <td>
                    <a href="${item.fileUrl}" class="file-link" download="${item.fileName}">
                        ${item.fileName} <i class="fas fa-download icon-red"></i>
                    </a>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}
*/

function renderTable(data) {

    const tableBody =
        document.getElementById('submission-list');

    tableBody.innerHTML = '';

    data.forEach(item => {

        const submittedDate =
            item.submittedAt
            ? new Date(item.submittedAt)
            : null;

        const date =
            submittedDate
            ? submittedDate.toLocaleDateString("th-TH")
            : "-";

        const time =
            submittedDate
            ? submittedDate.toLocaleTimeString("th-TH")
            : "-";

        const row = `
            <tr
                onclick="openSubmission(${item.id})"
                style="cursor:pointer;"
            >

                <td>${item.id}</td>

                <td>
                  ${item.studentCode || "-"}
                </td>

                <td>
                    ${item.studentName || "-"}
                </td>

                <td>
                    ${date}
                </td>

                <td>
                    ${time}
                </td>

                <td>
                    <a href="${item.fileUrl}"
                       target="_blank"
                       onclick="event.stopPropagation()">

                        ${item.fileName}

                        <i class="fas fa-download icon-red"></i>
                    </a>
                </td>

            </tr>
        `;

        tableBody.insertAdjacentHTML(
            'beforeend',
            row
        );

    });
}

function openSubmission(submissionId) {

    window.location.href =
        `/HTML/assignment_detail_instructor.html?submissionId=${submissionId}`;

}

function updateStatCards(data) {
    if (!data || !Array.isArray(data)) return;

    const total = data.length;
	const onTime =
	    data.filter(i => !i.late).length;

	const late =
	    data.filter(i => i.late).length;

    const totalEl = document.querySelector('.stat-submitted .stat-number');
    const onTimeEl = document.querySelector('.stat-ontime .stat-number');
    const lateEl = document.querySelector('.stat-late .stat-number');

    if (totalEl) totalEl.innerText = total;
    if (onTimeEl) onTimeEl.innerText = onTime;
    if (lateEl) lateEl.innerText = late;
}

function setupEventListeners() {
    // 1. คลิกที่กล่อง Stat เพื่อกรองข้อมูล (On time / Late)
    const cardAll = document.querySelector('.stat-submitted');
    const cardOnTime = document.querySelector('.stat-ontime');
    const cardLate = document.querySelector('.stat-late');

    if(cardAll) cardAll.addEventListener('click', () => filterData('all'));
    if(cardOnTime) cardOnTime.addEventListener('click', () => filterData('on-time'));
    if(cardLate) cardLate.addEventListener('click', () => filterData('late'));
	
	

    // 2. ปุ่ม Toolbar (All, A-Z, Date, ID)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const type = this.innerText.trim();
            
            // เพิ่มเงื่อนไขการเรียกใช้ฟังก์ชันเรียงลำดับ
            if (type === 'All') {
                renderTable(allSubmissions); // แสดงทั้งหมดแบบไม่เรียง
            } else if (type === 'A - Z') {
                sortData('name');
            } else if (type === 'Date') {
                sortData('date');
            } else if (type === 'ID') {
                sortData('id');
            }
        });
    });

    // 3. ปุ่ม Download All
    const downloadAllBtn = document.querySelector('.download-all-btn');
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', () => {
            if (allSubmissions.length === 0) {
                alert('ไม่มีไฟล์ให้ดาวน์โหลด');
                return;
            }
			
			const params =
			    new URLSearchParams(window.location.search);

			const assignmentId =
			    params.get("assignmentId");

			window.location.href =
			    `http://localhost:8080/submissions/assignment/${assignmentId}/download-all`;
				
				
            /*allSubmissions.forEach(item => {
                const link = document.createElement('a');
                link.href = item.fileUrl;
                link.download = item.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
			*/
        });
    }
}

function sortData(sortBy) {
    let sortedData = [...allSubmissions];

    if (sortBy === 'name') {
        // เรียงตามชื่อตัวอักษร A-Z
		sortedData.sort((a, b) =>
		    (a.studentName || "")
		        .localeCompare(b.studentName || "")
		);
    } 
    else if (sortBy === 'id') {
        // เรียงตามรหัสนักศึกษาจากน้อยไปมาก
		sortedData.sort((a, b) => {

		       const idA =
		           a.studentCode || "";

		       const idB =
		           b.studentCode || "";

		       return idA.localeCompare(idB);

		   });
    } 
    else if (sortBy === 'date') {
        // เรียงตามวันที่ (ต้องมั่นใจว่ารูปแบบวันที่ใน Java ส่งมาเป็นมาตรฐาน เช่น YYYY-MM-DD)
		sortedData.sort(
		    (a, b) =>
				new Date(a.submittedAt)
				- new Date(b.submittedAt)
		);
    }

    // เมื่อเรียงเสร็จแล้ว สั่งให้ตารางแสดงผลใหม่
    renderTable(sortedData);
}


function setupBackButton() {

    const params =
        new URLSearchParams(window.location.search);

    const courseId =
        params.get("courseId");

    const backBtn =
        document.querySelector(".back-btn");

    if (backBtn && courseId) {

        backBtn.onclick = (e) => {

            e.preventDefault();

            window.location.href =
                `create_assignments_all.html?courseId=${courseId}`;
        };
    }
}


async function loadAssignmentInfo() {

    const params =
        new URLSearchParams(window.location.search);

    const assignmentId =
        params.get("assignmentId");

    try {

        const response =
            await fetch(
                `http://localhost:8080/assignments/${assignmentId}`
            );

        if (!response.ok)
            throw new Error("Assignment not found");

        const assignment =
            await response.json();

        document.getElementById("assignmentTitle")
            .innerText = assignment.title;

    } catch (err) {

        console.error(err);

        document.getElementById("assignmentTitle")
            .innerText = "Assignment";
    }
}
/*
async function loadSubmissions() {

    const params =
        new URLSearchParams(window.location.search);

    const assignmentId =
        params.get("assignmentId");

    const response =
        await fetch(
            `http://localhost:8080/submissions/assignment/${assignmentId}`
        );

    const submissions =
        await response.json();

    // ===== CARD COUNT =====

    const submittedCount =
        submissions.length;

    const onTimeCount =
        submissions.filter(
            s => !s.late
        ).length;

    const lateCount =
        submissions.filter(
            s => s.late
        ).length;

    document.querySelector(
        ".stat-submitted .stat-number"
    ).innerText = submittedCount;

    document.querySelector(
        ".stat-ontime .stat-number"
    ).innerText = onTimeCount;

    document.querySelector(
        ".stat-late .stat-number"
    ).innerText = lateCount;

    // ===== TABLE =====

    renderTable(submissions);
}

loadAssignmentInfo();
loadSubmissions();

*/

