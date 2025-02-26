'use client';

import { useRef } from 'react';

function ImageChecker() {
  const fileInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];

    if (file) {
        console.log("file info: ", file);
      const isGrayscale = await isImageGrayscale(file);
      if (isGrayscale) {
        alert('The image is black and white.');
      } else {
        alert('The image is in color.');
      }
    }
  };

  const isImageGrayscale = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
          let grayscale = true;
          for (let i = 0; i < imageData.length; i += 4) {
            const red = imageData[i];
            const green = imageData[i + 1];
            const blue = imageData[i + 2];
            if (red !== green || green !== blue) {
              grayscale = false;
              break;
            }
          }
          resolve(grayscale);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" ref={fileInputRef} />
      <button type="submit">Check Image</button>
    </form>
  );
}

export default ImageChecker;