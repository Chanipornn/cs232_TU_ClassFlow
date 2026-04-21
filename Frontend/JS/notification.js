async function fetchStudentNotifications() {
    const API_URL = 'http://localhost:8080/api/notifications/student'; 

    try {
        const response = await fetch(API_URL);
        const notifications = await response.json();

        const container = document.getElementById('notification-container');
        const emptyState = document.getElementById('empty-state');
        
        container.innerHTML = ''; // ล้างข้อมูลเก่า

        // --- จุดที่ต้องแก้ ---
        if (notifications.length === 0) {
            // ถ้าไม่มีข้อมูล: ซ่อนกล่องข้อมูล, โชว์กล่อง "Not Found"
            container.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            // ถ้ามีข้อมูล: โชว์กล่องข้อมูล, ซ่อนกล่อง "Not Found"
            container.style.display = 'block';
            emptyState.style.display = 'none';

            // วนลูปสร้าง Card ตามปกติ
            notifications.forEach(notif => {
                // ...โค้ดสร้าง Html เดิมของคุณ...
                container.insertAdjacentHTML('beforeend', cardHtml);
            });
        }

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('notification-container').style.display = 'none';
        document.getElementById('empty-state').style.display = 'flex';
        document.getElementById('empty-state').innerHTML = '<p style="color:red;">Error loading notifications</p>';
    }
}