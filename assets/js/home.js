// home.js

let uploadedPhotos = [];
let currentSlide = 0;
let carouselInterval;

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileInputBtn = document.getElementById("fileInputBtn");
const uploadStatus = document.getElementById("uploadStatus");
const carouselSlides = document.querySelectorAll(".carousel-slide");
const carouselDots = document.querySelectorAll(".carousel-dot");

fileInputBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", e => handleFiles(e.target.files));

["dragenter", "dragover", "dragleave", "drop"].forEach(evt => {
  dropzone.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});
["dragenter", "dragover"].forEach(evt =>
  dropzone.addEventListener(evt, () => dropzone.classList.add("active"))
);
["dragleave", "drop"].forEach(evt =>
  dropzone.addEventListener(evt, () => dropzone.classList.remove("active"))
);
dropzone.addEventListener("drop", e => handleFiles(e.dataTransfer.files));

function handleFiles(files) {
  const totalSlots = 4; // karena tiap bingkai ada 3 slot
  const newPhotos = [];

  Array.from(files).forEach(file => {
    if (!file.type.startsWith("image/")) {
      console.warn(`File ${file.name} bukan gambar, diabaikan.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      newPhotos.push(e.target.result);

      if (newPhotos.length === files.length) {
        // tambahkan foto baru sesuai urutan
        uploadedPhotos = [...uploadedPhotos, ...newPhotos];

        // batasi maksimal 3 foto
        if (uploadedPhotos.length > totalSlots) {
          uploadedPhotos = uploadedPhotos.slice(0, totalSlots);
        }

        // simpan ke sessionStorage (biar gak nyangkut kalau reload)
        sessionStorage.setItem("photoBoxUploads", JSON.stringify(uploadedPhotos));

        console.log("Foto disimpan ke sessionStorage:", uploadedPhotos);

        uploadStatus.textContent = `${uploadedPhotos.length} foto diunggah`;

        // kalau sudah lengkap → redirect otomatis
        if (uploadedPhotos.length === totalSlots) {
          window.location.href = "bingkai.html";
        }
      }
    };
    reader.readAsDataURL(file);
  });
}

function startCarousel() {
  clearInterval(carouselInterval);
  showSlide(currentSlide);
  carouselInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    showSlide(currentSlide);
  }, 3000);
}

carouselDots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentSlide = i;
    showSlide(currentSlide);
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % carouselSlides.length;
      showSlide(currentSlide);
    }, 3000);
  });
});

function showSlide(n) {
  carouselSlides.forEach((slide, idx) => {
    slide.classList.remove("active");
    slide.style.opacity = "";
  });
  carouselDots.forEach(dot => dot.classList.remove("bg-blue-800", "active"));
  carouselSlides[n].classList.add("active");
  carouselSlides[n].style.opacity = 1;
  carouselDots[n].classList.add("bg-blue-800", "active");
}

document.addEventListener("DOMContentLoaded", () => {
  const stored = JSON.parse(sessionStorage.getItem("photoBoxUploads") || "[]");
  if (stored.length) {
    uploadedPhotos = stored;
    console.log("Foto dimuat dari sessionStorage:", uploadedPhotos);
    uploadStatus.textContent = `${uploadedPhotos.length} foto diunggah`;
  }
  startCarousel();
});
