document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
  
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
  
      events: [
        {
          title: 'Assignment 1',
          date: '2026-03-15',
          color: 'red'
        },
        {
          title: 'Quiz 2',
          date: '2026-03-18',
          color: 'orange'
        },
        {
          title: 'Project Proposal',
          date: '2026-03-22',
          color: 'green'
        }
      ],
  
      // กดวันที่
      dateClick: function(info) {
        alert("Clicked: " + info.dateStr);
      },
  
      // กด event
      eventClick: function(info) {
        alert("Event: " + info.event.title);
      }
    });
    events: [
      {
        title: 'Assign',
        date: '2026-03-15',
        className: 'red'
      },
      {
        title: 'Quiz',
        date: '2026-03-18',
        className: 'orange'
      }
    ],
  
    calendar.render();
    
  });
  