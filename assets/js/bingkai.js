const frameTemplates = [
  {
    src: "assets/framer/bingkai.png", // untuk mengubah bingkai
    positions: [
      { x: 50, y: 10, w: 696, h: 512 },
      { x: 50, y: 440, w: 696, h: 512 },
      { x: 50, y: 870, w: 696, h: 512 },
      { x: 50, y: 1300, w: 696, h: 512 },
    ],
    size: { w: 796, h: 2048 },
  },
  {
    src: "assets/framer/bingkai.png",
    positions: [
      { x: 50, y: 10, w: 696, h: 512 },
      { x: 50, y: 440, w: 696, h: 512 },
      { x: 50, y: 870, w: 696, h: 512 },
      { x: 50, y: 1300, w: 696, h: 512 },
    ],
    size: { w: 796, h: 2048 },
  },
  {
    src: "assets/framer/bingkai.png",
    positions: [
      { x: 50, y: 10, w: 696, h: 512 },
      { x: 50, y: 440, w: 696, h: 512 },
      { x: 50, y: 870, w: 696, h: 512 },
      { x: 50, y: 1300, w: 696, h: 512 },
    ],
    size: { w: 796, h: 2048 },
  },
  {
    src: "assets/framer/bingkai.png",
    positions: [
      { x: 50, y: 10, w: 696, h: 512 },
      { x: 50, y: 440, w: 696, h: 512 },
      { x: 50, y: 870, w: 696, h: 512 },
      { x: 50, y: 1300, w: 696, h: 512 },
    ],
    size: { w: 796, h: 2048 },
  },
  {
    src: "assets/framer/bingkai.png",
    positions: [
      { x: 50, y: 10, w: 696, h: 512 },
      { x: 50, y: 440, w: 696, h: 512 },
      { x: 50, y: 870, w: 696, h: 512 },
      { x: 50, y: 1300, w: 696, h: 512 },
    ],
    size: { w: 796, h: 2048 },
  },
  {
    src: "assets/framer/bingkai.png",
    positions: [
      { x: 50, y: 10, w: 696, h: 512 },
      { x: 50, y: 440, w: 696, h: 512 },
      { x: 50, y: 870, w: 696, h: 512 },
      { x: 50, y: 1300, w: 696, h: 512 },
    ],
    size: { w: 796, h: 2048 },
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

  // Yang pertama
  // async function createThreeSlotGIF(uploads) {
  //   return new Promise((resolve) => {
  //     function loadImage(src) {
  //       return new Promise((res) => {
  //         const img = new Image();
  //         img.crossOrigin = "anonymous";
  //         img.onload = () => res(img);
  //         img.onerror = () => res(null);
  //         img.src = src;
  //       });
  //     }

  //     function normalizeToSlot(img, targetW, targetH) {
  //       const tempCanvas = document.createElement("canvas");
  //       const tctx = tempCanvas.getContext("2d");
  //       tempCanvas.width = targetW;
  //       tempCanvas.height = targetH;

  //       const scale = Math.max(targetW / img.width, targetH / img.height);
  //       const drawW = img.width * scale;
  //       const drawH = img.height * scale;
  //       const drawX = (targetW - drawW) / 2;
  //       const drawY = (targetH - drawH) / 2;

  //       tctx.drawImage(img, drawX, drawY, drawW, drawH);
  //       return tempCanvas;
  //     }

  //     (async () => {
  //       if (!uploads.length) {
  //         resolve(null);
  //         return;
  //       }

  //       // load template PNG sekali
  //       const template = await loadImage("assets/framer/SG.png");
  //       if (!template) {
  //         console.error("Template PNG gagal dimuat!");
  //         resolve(null);
  //         return;
  //       }

  //       // canvas ikut ukuran template
  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");
  //       canvas.width = template.width;
  //       canvas.height = template.height;

  //       // 🔥 pakai koordinat slot dari frameTemplates
  //       const slotPositions = [
  //         { x: 0, y: 0, w: 1080, h: 586 }, // slot 1
  //         { x: 0, y: 590, w: 1080, h: 586 }, // slot 2
  //         { x: 0, y: 1180, w: 1080, h: 586 }, // slot 3
  //       ];

  //       const perImage = 2;
  //       const frameCount = 15 / perImage;
  //       const gifFrames = [];

  //       for (let f = 0; f < frameCount; f++) {
  //         ctx.fillStyle = "#000";
  //         ctx.fillRect(0, 0, canvas.width, canvas.height);

  //         for (let sIndex = 0; sIndex < slotPositions.length; sIndex++) {
  //           const fotoIndex = (f + sIndex) % uploads.length;
  //           const img = await loadImage(uploads[fotoIndex]);
  //           if (img) {
  //             const slot = slotPositions[sIndex];
  //             const normalized = normalizeToSlot(img, slot.w, slot.h);
  //             ctx.drawImage(normalized, slot.x, slot.y);
  //           }
  //         }

  //         // tempel framer di atas foto
  //         ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

  //         gifFrames.push(canvas.toDataURL("image/png"));
  //       }

  //       gifshot.createGIF(
  //         {
  //           images: gifFrames,
  //           gifWidth: canvas.width,
  //           gifHeight: canvas.height,
  //           interval: perImage,
  //           loop: 0,
  //           numColors: 128,
  //         },
  //         function (obj) {
  //           if (!obj.error) {
  //             resolve(dataURItoBlob(obj.image));
  //           } else {
  //             console.error("Gagal bikin GIF:", obj.error);
  //             resolve(null);
  //           }
  //         }
  //       );
  //     })();
  //   });
  // }

  // Yang Kedua
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

        // cover penuh
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

        const slotWidth = 480; // mengubah ukuran Frame
        const slotHeight = 270;
        const totalHeight = slotHeight * 3;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = slotWidth;
        canvas.height = totalHeight;

        const perImage = 1; // detik per frame
        const frameCount = 15 / perImage;

        const gifFrames = [];

        // template PNG
        const template = await loadImage("assets/framer/SG.png"); // mengubah bingkai gif

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

          // tempel template PNG di atas layer foto
          if (template) {
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
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
            numColors: 128,
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
            zip.file(`${nama}_mentahan_${idx + 1}.png`, blob); // mengubah nama file mentahan
          });
      }
    });

    // tambah hasil frame PNG
    selectedFrames.forEach((frame, idx) => {
      const dataURL = frame.canvas.toDataURL("image/png");
      const b64 = dataURL.split(",")[1];
      zip.file(`hasil_${nama}_frame${frame.index + 1}.png`, b64, {
        // mengubah nama file frame
        base64: true,
      });
    });

    // buat 1 GIF 3 slot (photostrip)
    createThreeSlotGIF(uploads).then((gifBlob) => {
      if (gifBlob) {
        zip.file(`hasil_${nama}.gif`, gifBlob); // ubah nama GIF
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
