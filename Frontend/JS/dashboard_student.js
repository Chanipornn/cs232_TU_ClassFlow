document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // ===== Calendar =====
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',

    events: [
      { title: '', date: '2026-03-15', className: 'dot-red' },
      { title: '', date: '2026-03-18', className: 'dot-orange' },
      { title: '', date: '2026-03-22', className: 'dot-green' }

    ],

    dateClick: function(info) {
      alert("Clicked: " + info.dateStr);
    }
  });

  calendar.render();


 // ===== TOKEN (Cognito safe) =====
  const token =
    localStorage.getItem("idToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  // ต้องเช็คก่อนใช้ token
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  // ===== JWT decode =====
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("JWT decode error:", err);
      return null;
    }
  }

  const user = parseJwt(token);

  console.log("User:", user);

  // fallback กัน crash
  const email = user?.email || user?.["cognito:username"] || "user";
  const name = email.includes("@") ? email.split("@")[0] : email;

  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    usernameEl.innerText = name;
  }




  // ===== call backend =====
  fetch("http://localhost:8080/api/test", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.text())
  .then(data => {
    console.log("Backend response:", data);
  })
  .catch(err => {
    console.error("Backend error:", err);
  });




});