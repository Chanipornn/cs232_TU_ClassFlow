async function fetchInstructorNotifications() {
    const API_URL = 'http://localhost:8080/api/notifications/instructor';

try {
    const response = await fetch(API_URL);
    const notifications = await response.json();

    const container = document.getElementById('notification-container');
    const emptyState = document.getElementById('empty-state');

    container.innerHTML = '';

    if (notifications.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        container.style.display = 'block';
        emptyState.style.display = 'none';


    notifications.forEach(notif => {
        const activeClass = notif.isNew ? 'active' : '';
        const dot = notif.isNew ? '<span class="dot"></span>' : '';
        
        const html = `
            <div class="card ${activeClass}">
                <div class="card-top">
                    <div class="today">${dot} Today</div>
                    <div class="time">${notif.time}</div>
                </div>
                <p class="title">${notif.title}</p>
                <p class="desc">${notif.desc}</p>
                <p class="time-small">${notif.timeSmall}</p>
                <div class="line"></div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

} 
}
catch (error) {
        console.error("Error:", error);
        document.getElementById('notification-container').innerHTML = '<p style="text-align:center; color:red;">Error connecting to server</p>';
    }
}
// รันฟังก์ชัน
fetchInstructorNotifications();