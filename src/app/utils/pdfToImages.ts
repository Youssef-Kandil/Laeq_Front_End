import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/build/pdf.worker.entry";
// عرّف الـ worker بشكل يدوي
// عرّف الـ worker من الملف اللي في public
pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.min.js";

// util function
export async function pdfToImages(url: string, scale = 1.5): Promise<string[]> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  const numPages = pdf.numPages;

  const images: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport,canvas }).promise;

    // حول الكانفس لصورة Base64
    images.push(canvas.toDataURL("image/png"));
  }

  return images;
}
