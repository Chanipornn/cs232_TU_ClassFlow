function renderNotifications(notifications) {
    const container = document.getElementById('notification-container');
    const emptyState = document.getElementById('empty-state');

    if (notifications.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    container.innerHTML = ''; // ล้าง Loading
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

// รันฟังก์ชัน
renderNotifications(mockData);