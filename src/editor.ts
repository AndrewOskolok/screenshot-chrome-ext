import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("screenshot", (result) => {
    const screenshotEl = document.getElementById(
      "screenshot"
    ) as HTMLImageElement;
    if (result.screenshot && screenshotEl) {
      screenshotEl.src = result.screenshot;
    }

    let cropper: Cropper;
    screenshotEl.addEventListener("load", () => {
      cropper = new Cropper(screenshotEl, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCropArea: 1,
      });
    });

    const rotateBtn = document.getElementById("rotate") as HTMLButtonElement;
    const resetBtn = document.getElementById("reset") as HTMLButtonElement;
    const downloadBtn = document.getElementById(
      "download"
    ) as HTMLButtonElement;

    rotateBtn.addEventListener("click", () => {
      if (cropper) {
        cropper.rotate(90);
      }
    });

    resetBtn.addEventListener("click", () => {
      if (cropper) {
        cropper.reset();
      }
    });

    downloadBtn.addEventListener("click", () => {
      if (cropper) {
        const canvas = cropper.getCroppedCanvas();

        if (canvas) {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "screenshot.png";
          link.click();
        }
      }
    });
  });
});
