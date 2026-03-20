document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',

    events: [
      {
        title: '',
        date: '2026-03-15',
        className: 'dot-red'
      },
      {
        title: '',
        date: '2026-03-18',
        className: 'dot-orange'
      },
      {
        title: '',
        date: '2026-03-22',
        className: 'dot-green'
      }
    ],

    dateClick: function(info) {
      alert("Clicked: " + info.dateStr);
    }
  });

  calendar.render();
});