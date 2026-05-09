document.addEventListener(
    "DOMContentLoaded",
    loadProfile
);

function loadProfile() {

    // โหลดจาก localStorage ก่อน

    const profile =
        JSON.parse(
            localStorage.getItem("profile")
        ) || {};

    document.getElementById("email").value =
        profile.email || "";

    document.getElementById("studentId").value =
        profile.studentId || "";

    document.getElementById("fullName").value =
        profile.fullName || "";

    document.getElementById("faculty").value =
        profile.faculty || "";

    document.getElementById("department").value =
        profile.department || "";

    document.getElementById("profileName")
        .innerText =
            profile.fullName || "Student";

    document.getElementById("profileRole")
        .innerText =
            "Student";
}

document.getElementById("saveBtn")
    .addEventListener(
        "click",
        saveProfile
);

function saveProfile() {

    const profile = {

        email:
        document.getElementById("email").value,

        studentId:
        document.getElementById("studentId").value,

        fullName:
        document.getElementById("fullName").value,

        faculty:
        document.getElementById("faculty").value,

        department:
        document.getElementById("department").value
    };

    // save localStorage

    localStorage.setItem(
        "profile",
        JSON.stringify(profile)
    );

    localStorage.setItem(
        "studentId",
        profile.studentId
    );

    localStorage.setItem(
        "fullName",
        profile.fullName
    );

    // update name

    document.getElementById("profileName")
        .innerText =
        profile.fullName || "Student";

    // popup

    showSavePopup();
}

function showSavePopup() {

    const popup =
        document.createElement("div");

    popup.className = "success-popup";

    popup.innerHTML = `

        <div class="success-box">

            <div class="success-icon">
                <i class="fa-solid fa-check"></i>
            </div>

            <h2>Success</h2>

            <p>Profile saved successfully</p>

        </div>

    `;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("show");
    }, 10);

    setTimeout(() => {

        popup.classList.remove("show");

        setTimeout(() => {

            popup.remove();

            window.location.href =
                "/HTML/dashboard_student.html";

        }, 300);

    }, 1800);
}