document.addEventListener("DOMContentLoaded", function () {

    const fileInput = document.getElementById("fileInput");
    const fileName = document.getElementById("fileName");
    const uploadBox = document.getElementById("uploadBox");
  
    // ===== เปิด file dialog =====
    window.openFile = function () {
      fileInput.click();
    };
  
    // ===== เลือกไฟล์ =====
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        showFile(file);
      }
    });
  
    // ===== drag & drop =====
    uploadBox.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadBox.style.background = "#f0f0ff";
    });
  
    uploadBox.addEventListener("dragleave", () => {
      uploadBox.style.background = "";
    });
  
    uploadBox.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadBox.style.background = "";
  
      const file = e.dataTransfer.files[0];
      if (file) {
        fileInput.files = e.dataTransfer.files;
        showFile(file);
      }
    });
  
    // ===== แสดงชื่อไฟล์ =====
    function showFile(file) {
      fileName.innerText = "Selected: " + file.name;
    }
  
    // ===== submit =====
    const submitBtn = document.querySelector(".primary-btn");
  
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
  
        if (!fileInput.files.length) {
          alert("Please upload a file first");
          return;
        }
  
        const file = fileInput.files[0];
  
        console.log("Submitting:", file);
  
        alert("Submitted: " + file.name);
  
        // ต่อ backend ทีหลัง
      });
    }
  
  });

  uploadBox.addEventListener("click", () => {
    fileInput.click();
  });