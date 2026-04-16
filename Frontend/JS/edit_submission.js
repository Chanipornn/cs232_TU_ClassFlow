const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const fileDate = document.getElementById("fileDate");
const fileSize = document.getElementById("fileSize");
const fileType = document.getElementById("fileType");
const deleteBtn = document.getElementById("deleteBtn");
const uploadBox = document.getElementById("uploadBox");
const emptyState = document.getElementById("emptyState");
const submitBtn = document.getElementById("submitBtn");

function resetState() {
  fileName.textContent = "-";
  fileDate.textContent = "-";
  fileSize.textContent = "-";
  fileType.textContent = "-";

  uploadBox.classList.remove("filled");
  uploadBox.classList.add("empty");

  emptyState.style.display = "flex";
  submitBtn.textContent = "Submit";
}

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  fileName.textContent = file.name;

  const today = new Date();
  fileDate.textContent = today.toLocaleDateString("en-GB");

  const sizeKB = file.size / 1024;
  fileSize.textContent = sizeKB >= 1024
    ? (sizeKB / 1024).toFixed(2) + " MB"
    : sizeKB.toFixed(1) + " KB";

  fileType.textContent = file.type || "Unknown";

  uploadBox.classList.remove("empty");
  uploadBox.classList.add("filled");

  emptyState.style.display = "none";
  submitBtn.textContent = "Save changes";
});

deleteBtn.addEventListener("click", function () {
  fileInput.value = "";
  resetState();
});

submitBtn.addEventListener("click", function () {
  if (!fileInput.files.length && fileName.textContent === "-") {
    alert("Please upload a file first");
    return;
  }

  alert("Submitted successfully!");
});