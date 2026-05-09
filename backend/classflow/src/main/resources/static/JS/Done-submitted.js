async function fetchSubmissionAndFeedback() {

    const urlParams =
        new URLSearchParams(window.location.search);

    const assignmentId =
        urlParams.get('id');

    const studentCode =
        localStorage.getItem("studentId");

    if (!assignmentId) {

        console.error("Assignment ID is missing!");
        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:8080/submissions/assignment/${assignmentId}`
            );

        if (!response.ok)
            throw new Error("Failed to fetch data");

        const submissions =
            await response.json();

        // หา submission ของ student คนนี้
        const data =
            submissions.find(
                s => s.studentCode === studentCode
            );

        if (!data)
            throw new Error("Submission not found");

        console.log(data);

        renderDonePage(data);

    } catch (error) {

        console.error("Error:", error);

        document.getElementById(
            'assignment-detail-container'
        ).innerHTML =
            `
            <p style="color:red;text-align:center;">
                Error: Could not load data.
            </p>
            `;
    }
}

function renderDonePage(data) {

    // ======================
    // HEADER
    // ======================

    document.getElementById(
        "assign-title"
    ).innerText =
        data.assignment?.title || "Assignment";

    // ======================
    // STATUS
    // ======================

    let statusClass = "submit-btn";

    let statusText =
        "SUBMITTED";

    let timeStyle = "";

    if (data.late) {

        statusClass = "late-btn";

        statusText =
            "LATE SUBMITTED";

        timeStyle =
            "color:red;font-weight:bold;";
    }

    // ======================
    // TIME REMAINING
    // ======================

    let timeRemaining = "-";

    if (data.assignment?.deadline) {

        const now = new Date();

        const due =
            new Date(
                data.assignment.deadline
            );

        const diff =
            due - now;

        const days =
            Math.ceil(
                diff / (1000 * 60 * 60 * 24)
            );

        if (days > 0)
            timeRemaining =
                `${days} days remaining`;

        else
            timeRemaining =
                "Expired";
    }

    // ======================
    // DESCRIPTION
    // ======================

    document.getElementById(
        "assignment-detail-container"
    ).innerHTML = `

        <p><strong>Description</strong></p>

        <p>
            ${data.assignment?.description || "-"}
        </p>

        <br>

        <p><strong>Requirements</strong></p>

        <p>
            ${data.assignment?.requirements || "-"}
        </p>

        <br>

        <p><strong>Time remaining</strong></p>

        <p style="${timeStyle}">
            ${timeRemaining}
        </p>

        <button class="${statusClass}">
            ${statusText}
        </button>
    `;

    // ======================
    // SUBMISSION TABLE
    // ======================

    document.getElementById(
        "sub-status-text"
    ).innerText =
        data.late
            ? "Late Submission"
            : "Submitted";

    document.getElementById(
        "sub-due-date"
    ).innerText =
        new Date(
            data.assignment.deadline
        ).toLocaleString("th-TH");

    document.getElementById(
        "sub-done-status"
    ).innerText =
        new Date(
            data.submittedAt
        ).toLocaleString("th-TH");

    document.getElementById(
        "sub-file-link"
    ).innerHTML = `
        <a href="${data.fileUrl}" target="_blank">
            ${data.fileName}
        </a>
    `;

    // ======================
    // FEEDBACK
    // ======================

    const maxScore =
        data.maxScore || 100;

    document.getElementById(
        "fb-grade"
    ).innerText =
        `${data.grade || 0} / ${maxScore}`;

    document.getElementById(
        "fb-comment"
    ).innerText =
        data.comment || "-";

    document.getElementById(
        "fb-teacher"
    ).innerText =
        data.gradedBy || "Not graded yet";
}

document.addEventListener(
    'DOMContentLoaded',
    fetchSubmissionAndFeedback
);