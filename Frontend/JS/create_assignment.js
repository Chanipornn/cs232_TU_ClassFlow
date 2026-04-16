document.addEventListener("DOMContentLoaded", () => {
    setupSearch();
    setupDeleteButtons();
    setupAccordions();
    setupSaveButton();
    setupProfileButton();
  });
  
  function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const cards = document.querySelectorAll(".assignment-card");
  
    if (!searchInput || cards.length === 0) return;
  
    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase().trim();
  
      cards.forEach((card) => {
        const title = card.dataset.title.toLowerCase();
        if (title.includes(keyword)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
  
  function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
  
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const card = this.closest(".assignment-card");
        const confirmDelete = confirm("Are you sure you want to delete this assignment?");
        if (confirmDelete && card) {
          card.remove();
        }
      });
    });
  }
  
  function setupAccordions() {
    const accordionHeaders = document.querySelectorAll(".accordion-header");
  
    accordionHeaders.forEach((header) => {
      header.addEventListener("click", function () {
        const card = this.parentElement;
        card.classList.toggle("open");
      });
    });
  }
  
  function setupSaveButton() {
    const saveBtn = document.getElementById("saveAssignmentBtn");
  
    if (!saveBtn) return;
  
    saveBtn.addEventListener("click", () => {
      alert("Saved successfully");
      window.location.href = "create_assignments_all.html";
    });
  }
  
  function setupProfileButton() {
    const profileBtn = document.querySelector(".profile-btn");
  
    if (!profileBtn) return;
  
    profileBtn.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Profile page not connected yet");
    });
  }