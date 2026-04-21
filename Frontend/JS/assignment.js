const API_URL = "http://localhost:3000/assignments";

let allAssignments = [];

async function fetchAssignments(filter = "all") {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    allAssignments = data;

    updateSummary();
    renderAssignments(filter);

  } catch (err) {
    console.error("Error:", err);
  }
}

function updateSummary() {
  const total = allAssignments.length;
  const submitted = allAssignments.filter(a => a.status === "submitted").length;

  document.getElementById("totalAssignments").innerText =
    "Assignments: " + total;

  const percent = total === 0 ? 0 : (submitted / total) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function renderAssignments(filter) {
  const container = document.getElementById("assignmentContainer");
  container.innerHTML = "";

  let filtered = allAssignments;

  if (filter !== "all") {
    filtered = allAssignments.filter(a => a.status === filter);
  }

  filtered.forEach(a => {
    let statusClass = "";
    let statusText = "";

    if (a.status === "submitted") {
      statusClass = "green";
      statusText = "Submitted";
    } else if (a.status === "pending") {
      statusClass = "yellow";
      statusText = "Pending";
    } else {
      statusClass = "red";
      statusText = "Not Submitted";
    }

    const card = `
      <div class="card">
        <div>
          <h3>${a.title}</h3>
          <p>Deadline: ${a.deadline}</p>
        </div>
        <span class="status ${statusClass}">${statusText}</span>
      </div>
    `;

    container.innerHTML += card;
  });
}

function searchAssignment(keyword, filter) {
  const container = document.getElementById("assignmentContainer");
  container.innerHTML = "";

  let filtered = allAssignments;

  if (filter !== "all") {
    filtered = filtered.filter(a => a.status === filter);
  }

  filtered = filtered.filter(a =>
    a.title.toLowerCase().includes(keyword.toLowerCase())
  );

  filtered.forEach(a => {
    const card = `
      <div class="card">
        <div>
          <h3>${a.title}</h3>
          <p>Deadline: ${a.deadline}</p>
        </div>
        <span class="status">${a.status}</span>
      </div>
    `;
    container.innerHTML += card;
  });
}