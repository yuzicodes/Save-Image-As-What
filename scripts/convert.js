window.downloadImage = function (url, format) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const img = document.createElement("img");
      const reader = new FileReader();

      reader.onload = function () {
        img.src = reader.result;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const mimeType = `image/${format}`;
          const supportedFormats = ["image/png", "image/jpeg", "image/webp"];
          const finalFormat = supportedFormats.includes(mimeType) ? mimeType : "image/png";

          canvas.toBlob(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `image.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, finalFormat);
        };
      };

      reader.readAsDataURL(blob);
    })
    .catch(error => {
      console.error("Failed to fetch image:", error);
      alert("Failed to convert this image. The format may not be supported.");
    });
};
