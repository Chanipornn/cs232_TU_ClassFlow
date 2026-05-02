const fileInput = document.getElementById("fileInput");
const fileNameEl = document.getElementById("fileName");
const fileDateEl = document.getElementById("fileDate");
const fileSizeEl = document.getElementById("fileSize");
const fileTypeEl = document.getElementById("fileType");
const deleteBtn = document.getElementById("deleteBtn");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const fileBtn = document.getElementById("fileBtn");
const linkBtn = document.getElementById("linkBtn");
const driveBtn = document.getElementById("driveBtn");
const dropboxBtn = document.getElementById("dropboxBtn");

let selectedSubmission = null;

function formatFileSize(bytes) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleDateString();
}

function renderSubmission(item) {
  if (!item) {
    fileNameEl.textContent = "No file selected";
    fileNameEl.removeAttribute("href");
    fileNameEl.removeAttribute("target");
    fileDateEl.textContent = "-";
    fileSizeEl.textContent = "-";
    fileTypeEl.textContent = "-";
    return;
  }

  if (item.kind === "link") {
    fileNameEl.textContent = item.name;
    fileNameEl.href = item.url;
    fileNameEl.target = "_blank";
  } else {
    fileNameEl.textContent = item.name;
    fileNameEl.href = "#";
    fileNameEl.removeAttribute("target");
  }

  fileDateEl.textContent = formatDate(item.lastModified);
  fileSizeEl.textContent = item.kind === "link" ? "-" : formatFileSize(item.size);
  fileTypeEl.textContent = item.kind === "link" ? (item.source || "Link") : (item.type || "Unknown");
}

function saveSubmission(item) {
  selectedSubmission = item;
  localStorage.setItem("submittedAssignment", JSON.stringify(item));
  renderSubmission(item);
}

function handleFile(file) {
  if (!file) return;

  const maxSize = 32 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("ไฟล์ต้องมีขนาดไม่เกิน 32MB");
    return;
  }

  saveSubmission({
    kind: "file",
    name: file.name,
    size: file.size,
    type: file.type || "Unknown",
    lastModified: file.lastModified || Date.now()
  });
}

function askForLink(sourceName) {
  const url = prompt(`Paste ${sourceName} link`);
  if (!url || !url.trim()) return;

  const trimmed = url.trim();

  try {
    new URL(trimmed);
  } catch (error) {
    alert("ลิงก์ไม่ถูกต้อง");
    return;
  }

  saveSubmission({
    kind: "link",
    source: sourceName,
    url: trimmed,
    name: trimmed,
    size: 0,
    type: "Link",
    lastModified: Date.now()
  });
}

const saved = localStorage.getItem("submittedAssignment");
if (saved) {
  try {
    selectedSubmission = JSON.parse(saved);
    renderSubmission(selectedSubmission);
  } catch (error) {
    renderSubmission(null);
  }
} else {
  renderSubmission(null);
}

fileBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    handleFile(fileInput.files[0]);
  }
});

linkBtn.addEventListener("click", () => askForLink("Link"));
driveBtn.addEventListener("click", () => askForLink("Google Drive"));
dropboxBtn.addEventListener("click", () => askForLink("Dropbox"));

deleteBtn.addEventListener("click", () => {
  selectedSubmission = null;
  localStorage.removeItem("submittedAssignment");
  renderSubmission(null);
});

submitBtn.addEventListener("click", () => {
  window.location.href = "Submitted_before_deadline.html";
});

cancelBtn.addEventListener("click", () => {
  window.location.href = "assignment_detail.html";
});