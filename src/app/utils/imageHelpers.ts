export async function resizeAndConvert_OLD(file: File, maxWidth = 500, maxHeight = 500) {
    // 1. اقرأ الملف
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  
    // 2. حمّل الصورة
    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = dataUrl;
    });
  
    // 3. احسب الأبعاد الجديدة مع الحفاظ على نسبة العرض للارتفاع
    let { width, height } = img;
    const aspect = width / height;
    if (width > maxWidth) {
      width = maxWidth;
      height = Math.round(width / aspect);
    }
    if (height > maxHeight) {
      height = maxHeight;
      width = Math.round(height * aspect);
    }
  
    // 4. ارسم على canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
  
    // 5. استخرج WebP Data URL (جودة 0.8)
    // const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
    const webpDataUrl = canvas.toDataURL('image/png', 0.8);
  
    // 6. حول لـ Blob عشان ترفعه
    const webpBlob = await (await fetch(webpDataUrl)).blob();
    return webpBlob; // تقدر تبعته في FormData
  }



  export async function resizeAndConvert(
    file: File,
    maxWidth = 500,
    maxHeight = 500,
    quality = 0.8  // ← قيمة افتراضية للجودة من 0 إلى 1
  ): Promise<Blob> {
    // 1. اقرأ الملف
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  
    // 2. حمّل الصورة
    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = dataUrl;
    });
  
    // 3. احسب الأبعاد الجديدة مع الحفاظ على نسبة العرض للارتفاع
    let { width, height } = img;
    const aspect = width / height;
    if (width > maxWidth) {
      width = maxWidth;
      height = Math.round(width / aspect);
    }
    if (height > maxHeight) {
      height = maxHeight;
      width = Math.round(height * aspect);
    }
  
    // 4. ارسم على canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
  
    // 5. استخرج WebP Data URL باستخدام الجودة الممررة
    // const webpDataUrl = canvas.toDataURL('image/webp', quality);
    const webpDataUrl = canvas.toDataURL('image/jpeg', quality);
  
    // 6. حول الـ Data URL إلى Blob
    const webpBlob = await (await fetch(webpDataUrl)).blob();
    return webpBlob;
  }


  // utils/imageHelpers.ts

async function blobToDataURL(b: Blob) {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(b);
  });
}

async function loadImage(src: string) {
  const img = new Image();
  await new Promise<void>(resolve => { img.onload = () => resolve(); img.src = src; });
  return img;
}

export async function upscaleImageWithSmoothing(
  blob: Blob,
  targetWidth: number,
  targetHeight: number,
  mime = 'image/webp',
  quality = 1
): Promise<Blob> {
  const dataUrl = await blobToDataURL(blob);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const outDataUrl = canvas.toDataURL(mime, quality);
  return (await fetch(outDataUrl)).blob();
}


  
  