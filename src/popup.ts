declare var ImageCapture: any;

document.addEventListener("DOMContentLoaded", () => {
  const viewportBtn = document.getElementById("viewport") as HTMLButtonElement;
  const screenWindowBtn = document.getElementById(
    "screenWindow"
  ) as HTMLButtonElement;

  if (!viewportBtn || !screenWindowBtn) {
    return;
  }

  viewportBtn.addEventListener("click", () => {
    chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl: string) => {
      chrome.storage.local.set({ screenshot: dataUrl });
      chrome.tabs.create({ url: "editor.html" });
    });
  });

  screenWindowBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");

        chrome.storage.local.set({ screenshot: dataUrl });
        chrome.tabs.create({ url: "editor.html" });
      }

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log("User denied screen sharing or an error occurred:", error);
    }
  });
});
