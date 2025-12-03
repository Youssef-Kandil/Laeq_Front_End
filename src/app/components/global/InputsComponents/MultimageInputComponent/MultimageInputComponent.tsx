"use client";
import React from "react";
import { LuImagePlus } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import Styles from "./MultimageInputComponent.module.css";
import { resizeAndConvert ,resizeAndConvertToWebp} from "@/app/utils/imageHelpers";
import Image from "next/image";
import { PDFDocument } from "pdf-lib";

interface Props {
  label: string;
  placeholder: string;
  onChange?: (previews: string[], blobs: Blob[]) => void;
  maxWidth?: number;
  maxHeight?: number;
  max_images?: number;
  quality?: number;
  asPdf?: boolean; // 👈 خيار جديد: هل نرجع PDF بدل الصور
}

export default function MultimageInputComponent({
  label,
  placeholder,
  onChange,
  maxWidth = 400,
  maxHeight = 400,
  max_images,
  quality = 0.8,
  asPdf = false,
}: Props) {
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [blobs, setBlobs] = React.useState<Blob[]>([]);
  const [pdfBlob, setPdfBlob] = React.useState<Blob | null>(null); // 👈 نخزن ملف الـ PDF هنا
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const MAX_IMAGES = max_images??5;

  React.useEffect(() => {
    if (blobs.length > 0) {
      if (asPdf) {
        convertImagesToPDF(blobs).then((pdfBlob) => {
          setPdfBlob(pdfBlob);
          if (onChange) onChange(previews, [pdfBlob]); // 👈 نرجع PDF بدل الصور
        });
      } else {
        if (onChange) onChange(previews, blobs);
      }
    } else {
      setPdfBlob(null);
      if (onChange) onChange([], []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blobs, asPdf]);

  const openFilePicker = () => {
    if (previews.length < MAX_IMAGES) inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const slots = MAX_IMAGES - previews.length;
    const toProcess = Array.from(files).slice(0, slots);

    const newPreviews: string[] = [];
    const newBlobs: Blob[] = [];

    for (const file of toProcess) {
      try {
        if(asPdf){
          const webpBlob = await resizeAndConvert(
            file,
            maxWidth,
            maxHeight,
            quality
          );
          newBlobs.push(webpBlob);
          newPreviews.push(URL.createObjectURL(webpBlob));
        }else{
          const webpBlob = await resizeAndConvertToWebp(
            file,
            maxWidth,
            maxHeight,
            quality
          );
          newBlobs.push(webpBlob);
          newPreviews.push(URL.createObjectURL(webpBlob));
        }
      } catch {
        // تجاهل أي خطأ في معالجة الصورة
      }
    }

    if (newPreviews.length === 0) {
      setError("لم يتم قبول أي صور (تحقق من الحجم أو الأبعاد).");
    } else {
      setError(null);
      setBlobs((prev) => [...prev, ...newBlobs]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setBlobs((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 👇 دالة تحويل الصور لملف PDF
  async function convertImagesToPDF(blobs: Blob[]): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();

    for (const blob of blobs) {
      const imgBytes = await blob.arrayBuffer();

      let img;
      try {
        img = await pdfDoc.embedJpg(imgBytes);
      } catch {
        img = await pdfDoc.embedPng(imgBytes);
      }

      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  }

  // 👇 فتح الـ PDF في تاب جديدة
  const showPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  return (
    <div className={Styles.ImageInput}>
      {error && <p className={Styles.errorMsg}>{error}</p>}
      <p>{label}</p>
      <section className={Styles.holder} onClick={openFilePicker}>
        <label>
          <LuImagePlus size={30} />
          <p>{placeholder}</p>
          <p>
            {previews.length} / {MAX_IMAGES}
          </p>
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </section>

      {/* 👇 الصور هتفضل تبان حتى لو asPdf = true */}
      {previews.length > 0 && (
        <section className={Styles.grid}>
          <div className={Styles.ImagesContainer}>
            {previews.map((src, i) => (
              <div key={i} className={Styles.previewBox}>
                <div
                  className={Styles.deleteIcon}
                  onClick={() => removeImage(i)}
                >
                  <RiDeleteBinLine size={20} color="red" />
                </div>
                <Image
                  src={src}
                  alt={`Preview ${i + 1}`}
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 👇 زرار Show PDF لو في PDF جاهز */}
      {asPdf && pdfBlob && (
        <button onClick={showPdf} className={Styles.showPdfBtn}>
          Show PDF
        </button>
      )}
    </div>
  );
}
