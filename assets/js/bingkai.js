const frameTemplates = [
  {
    src: "assets/framer/bingkai2.png",
    positions: [
      { x: 21.4, y: -35, w: 312, h: 265 },
      { x: 21.4, y: 152, w: 312, h: 265 },
      { x: 21.4, y: 343, w: 312, h: 265 },
      { x: 21.4, y: 534, w: 312, h: 265 },
    ],
    size: { w: 355, h: 768 },
  },

  {
    src: "assets/framer/bingkai2.png",
    positions: [
      { x: 21.4, y: -35, w: 312, h: 265 },
      { x: 21.4, y: 152, w: 312, h: 265 },
      { x: 21.4, y: 343, w: 312, h: 265 },
      { x: 21.4, y: 534, w: 312, h: 265 },
    ],
    size: { w: 355, h: 768 },
  },

  {
    src: "assets/framer/bingkai2.png",
    positions: [
      { x: 21.4, y: -35, w: 312, h: 265 },
      { x: 21.4, y: 152, w: 312, h: 265 },
      { x: 21.4, y: 343, w: 312, h: 265 },
      { x: 21.4, y: 534, w: 312, h: 265 },
    ],
    size: { w: 355, h: 768 },
  },

  {
    src: "assets/framer/bingkai2.png",
    positions: [
      { x: 21.4, y: -35, w: 312, h: 265 },
      { x: 21.4, y: 152, w: 312, h: 265 },
      { x: 21.4, y: 343, w: 312, h: 265 },
      { x: 21.4, y: 534, w: 312, h: 265 },
    ],
    size: { w: 355, h: 768 },
  },

  {
    src: "assets/framer/bingkai2.png",
    positions: [
      { x: 21.4, y: -35, w: 312, h: 265 },
      { x: 21.4, y: 152, w: 312, h: 265 },
      { x: 21.4, y: 343, w: 312, h: 265 },
      { x: 21.4, y: 534, w: 312, h: 265 },
    ],
    size: { w: 355, h: 768 },
  },

  {
    src: "assets/framer/bingkai2.png",
    positions: [
      { x: 21.4, y: -35, w: 312, h: 265 },
      { x: 21.4, y: 152, w: 312, h: 265 },
      { x: 21.4, y: 343, w: 312, h: 265 },
      { x: 21.4, y: 534, w: 312, h: 265 },
    ],
    size: { w: 355, h: 768 },
  },
];

function createFrameCanvas(templateSrc, positions, photoSrcs, size) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h;
    canvas.className = "mx-auto my-4 block";
    const ctx = canvas.getContext("2d");

    const template = new Image();
    template.crossOrigin = "anonymous";

    template.onload = () => {
      Promise.all(
        photoSrcs.map((src) => {
          if (!src) return Promise.resolve(null);
          return new Promise((res) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => res(img);
            img.onerror = () => res(null);
            img.src = src;
          });
        })
      ).then((images) => {
        positions.forEach((slot, index) => {
          const img = images[index];
          if (img) {
            const scaleX = slot.w / img.width;
            const scaleY = slot.h / img.height;
            const scale = Math.min(scaleX, scaleY);
            const drawW = img.width * scale;
            const drawH = img.height * scale;
            const drawX = slot.x + (slot.w - drawW) / 2;
            const drawY = slot.y + (slot.h - drawH) / 2;
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
          }
        });
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
        resolve(canvas);
      });
    };
    template.src = templateSrc;
  });
}

async function showFramesFromSession() {
  const uploads = JSON.parse(sessionStorage.getItem("photoBoxUploads") || "[]");
  const resultZone = document.getElementById("resultZone");

  if (!uploads.length) {
    resultZone.innerHTML =
      "<p class='text-center text-red-600'>Tidak ada foto yang diunggah.</p>";
    return;
  }

  resultZone.innerHTML = "";
  resultZone.className =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-4";

  let selectedFrames = [];

  for (let i = 0; i < frameTemplates.length; i++) {
    const frame = frameTemplates[i];
    const photosForFrame = uploads.slice(0, 4);

    const canvas = await createFrameCanvas(
      frame.src,
      frame.positions,
      photosForFrame,
      frame.size
    );

    const wrapper = document.createElement("div");
    wrapper.className =
      "flex flex-col items-center bg-white rounded-lg shadow-md p-3";
    wrapper.dataset.index = i;

    canvas.style.width = "100%";
    canvas.style.maxWidth = "180px";
    wrapper.appendChild(canvas);

    const label = document.createElement("label");
    label.className = "flex items-center mt-3 text-sm";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "mr-2 w-4 h-4";
    checkbox.dataset.index = i;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedFrames.push({ index: i, canvas: canvas });
      } else {
        selectedFrames = selectedFrames.filter((f) => f.index !== i);
      }
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(`Frame ${i + 1}`));
    wrapper.appendChild(label);
    resultZone.appendChild(wrapper);
  }

  function showNamePopup(selectedFrames, uploads) {
    if (!selectedFrames.length) {
      alert("Pilih minimal satu frame sebelum download!");
      return;
    }
    const nama = prompt("Masukkan nama file ZIP:");
    if (!nama) return;
    downloadZipWithFrames(nama, selectedFrames, uploads);
  }

  async function createThreeSlotGIF(uploads) {
    return new Promise((resolve) => {
      function loadImage(src) {
        return new Promise((res) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = src;
        });
      }

      function normalizeToLandscape(img, targetW, targetH) {
        const tempCanvas = document.createElement("canvas");
        const tctx = tempCanvas.getContext("2d");
        tempCanvas.width = targetW;
        tempCanvas.height = targetH;

        // hitung skala biar cover penuh
        const scale = Math.max(targetW / img.width, targetH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (targetW - drawW) / 2;
        const drawY = (targetH - drawH) / 2;

        tctx.drawImage(img, drawX, drawY, drawW, drawH);
        return tempCanvas;
      }

      (async () => {
        if (!uploads.length) {
          resolve(null);
          return;
        }

        const slotWidth = 1920; // landscape width
        const slotHeight = 1080; // landscape height
        const totalHeight = slotHeight * 3;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = slotWidth;
        canvas.height = totalHeight;

        const perImage = 2; // detik per frame
        const frameCount = 15 / perImage;

        const gifFrames = [];

        for (let f = 0; f < frameCount; f++) {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          for (let sIndex = 0; sIndex < 3; sIndex++) {
            const fotoIndex = (f + sIndex) % uploads.length;
            const img = await loadImage(uploads[fotoIndex]);
            if (img) {
              const normalized = normalizeToLandscape(
                img,
                slotWidth,
                slotHeight
              );
              ctx.drawImage(normalized, 0, sIndex * slotHeight);
            }
          }

          gifFrames.push(canvas.toDataURL("image/png"));
        }

        gifshot.createGIF(
          {
            images: gifFrames,
            gifWidth: canvas.width,
            gifHeight: canvas.height,
            interval: perImage,
            loop: 0,
            numColors: 128, // kompres ukuran file
          },
          function (obj) {
            if (!obj.error) {
              resolve(dataURItoBlob(obj.image));
            } else {
              console.error("Gagal bikin GIF:", obj.error);
              resolve(null);
            }
          }
        );
      })();
    });
  }

  function downloadZipWithFrames(nama, selectedFrames, uploads) {
    const zip = new JSZip();

    // tambah foto mentahan
    uploads.forEach((src, idx) => {
      if (src) {
        fetch(src)
          .then((res) => res.blob())
          .then((blob) => {
            zip.file(`${nama}_mentahan_${idx + 1}.png`, blob);
          });
      }
    });

    // tambah hasil frame PNG
    selectedFrames.forEach((frame, idx) => {
      const dataURL = frame.canvas.toDataURL("image/png");
      const b64 = dataURL.split(",")[1];
      zip.file(`hasil_${nama}_frame${frame.index + 1}.png`, b64, {
        base64: true,
      });
    });

    // buat 1 GIF 3 slot (photostrip)
    createThreeSlotGIF(uploads).then((gifBlob) => {
      if (gifBlob) {
        zip.file(`hasil_${nama}.gif`, gifBlob);
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${nama}_photoBox.zip`);
      });
    });
  }

  // helper ubah dataURI → Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  // tombol download
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download Semua Pilihan";
  downloadBtn.className =
    "mt-6 px-4 py-2 bg-green-600 text-white rounded block mx-auto";
  downloadBtn.onclick = () => showNamePopup(selectedFrames, uploads);
  resultZone.parentElement.appendChild(downloadBtn);

  // tombol reset
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset Foto";
  resetBtn.className =
    "mt-6 ml-4 px-4 py-2 bg-red-600 text-white rounded block mx-auto";
  resetBtn.onclick = () => {
    sessionStorage.removeItem("photoBoxUploads");
    resultZone.innerHTML =
      "<p class='text-center text-red-600'>Semua foto telah dihapus. Silakan unggah ulang.</p>";
    resultZone.parentElement.removeChild(downloadBtn);
    resultZone.parentElement.removeChild(resetBtn);
    window.location.href = "index.html";
  };
  resultZone.parentElement.appendChild(resetBtn);
}

window.addEventListener("DOMContentLoaded", () => {
  showFramesFromSession();
});
