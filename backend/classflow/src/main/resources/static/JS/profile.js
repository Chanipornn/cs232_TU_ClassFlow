document.addEventListener(
    "DOMContentLoaded",
    loadProfile
);

function loadProfile() {

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

function showError() {
    clearError();

    const fields = [
        { id: "email",      label: "Email" },
        { id: "studentId",  label: "Student ID" },
        { id: "fullName",   label: "Full Name" },
        { id: "faculty",    label: "Faculty" },
        { id: "department", label: "Department" }
    ];

    let hasError = false;

    fields.forEach(({ id, label }) => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
            const el = document.createElement("p");
            el.className = "field-error";
            el.style.cssText = "color: red; font-size: 13px; margin: 4px 0 0 4px;";
            el.textContent = `Please fill in ${label}`;
            input.after(el);
            hasError = true;
        }
    });

    return hasError;
}

function clearError() {
    document.querySelectorAll(".field-error").forEach(el => el.remove());
}

function saveProfile() {

    if (showError()) return;

    const email =
        document.getElementById("email").value.trim();

    const studentId =
        document.getElementById("studentId").value.trim();

    const fullName =
        document.getElementById("fullName").value.trim();

    const faculty =
        document.getElementById("faculty").value.trim();

    const department =
        document.getElementById("department").value.trim();

    const profile = { email, studentId, fullName, faculty, department };

    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("studentId", profile.studentId);
    localStorage.setItem("fullName", profile.fullName);

    document.getElementById("profileName")
        .innerText = profile.fullName || "Student";

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

document.getElementById("logoutBtn")
    .addEventListener(
        "click",
        logout
    );

function logout() {

    localStorage.removeItem("idToken");

    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    localStorage.removeItem("username");

    window.location.href = "/index.html";
}