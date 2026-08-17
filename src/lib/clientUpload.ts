export async function compressAndUploadImage(file: File, category: string = 'General'): Promise<string> {
  // If file is SVG or already under 1MB, upload directly
  if (file.type.includes('svg') || file.size < 1024 * 1024) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }
    return data.url;
  }

  // Compress image using HTML5 Canvas for large photos (smart resizing to max 1920px width/height)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1920;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context unavailable'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          async (blob) => {
            if (!blob) return reject(new Error('Image compression failed'));
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
              type: 'image/jpeg',
            });

            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('category', category);

            try {
              const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              });
              const data = await res.json();
              if (!data.success) {
                return reject(new Error(data.error || 'Upload failed'));
              }
              resolve(data.url);
            } catch (err) {
              reject(err);
            }
          },
          'image/jpeg',
          0.82
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
