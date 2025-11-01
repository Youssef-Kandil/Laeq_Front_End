"use client";
import React from "react";
import { LuImagePlus } from "react-icons/lu";
import Styles from "./imagInputComponent.module.css";
import Image from "next/image";

interface Props {
  lable: string;
  defaultValue?: string;
  onChange?: (image: Blob | null) => void;
}

function ImagInputComponent({ lable, defaultValue, onChange }: Props) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const parsedDefaultUrl = React.useMemo(() => {
    try {
      if (!defaultValue) return null;
      if (defaultValue.startsWith("{")) {
        const obj = JSON.parse(defaultValue);
        return obj?.fileUrl ?? null;
      }
      return defaultValue;
    } catch {
      return null;
    }
  }, [defaultValue]);

  React.useEffect(() => {
    if (parsedDefaultUrl) setPreview(parsedDefaultUrl);
  }, [parsedDefaultUrl]);

  // ✅ آمنة في Next.js: لا تستخدم window أو Image إلا في المتصفح
  const convertToWebp = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject("Not in browser environment");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        if (typeof window === "undefined") return;

        const img = document.createElement("img");
        img.crossOrigin = "anonymous";
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas not supported");

          ctx.drawImage(img, 0, 0);

          // ✅ نحاول نحفظها webp ولو فشل نحفظها jpeg
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else {
                canvas.toBlob(
                  (fallbackBlob) => {
                    if (fallbackBlob) resolve(fallbackBlob);
                    else reject("Conversion failed");
                  },
                  "image/jpeg",
                  0.9
                );
              }
            },
            "image/webp",
            0.9
          );
        };

        img.onerror = () => reject("Error loading image");
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeKB = 14449;
    const maxWidth = 8500;
    const maxHeight = 8500;

    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      setError(`حجم الصورة يجب أن يكون أقل من ${maxSizeKB} كيلوبايت.`);
      setPreview(null);
      onChange?.(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof window === "undefined") return;
      const img = document.createElement("img");

      img.onload = async () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          setError(`أبعاد الصورة يجب أن تكون ${maxWidth}×${maxHeight} بكسل أو أقل.`);
          setPreview(null);
          onChange?.(null);
        } else {
          setError(null);
          setPreview(e.target?.result as string);
          try {
            const webpBlob = await convertToWebp(file);
            onChange?.(webpBlob);
          } catch (err) {
            console.error("Error converting to webp:", err);
            onChange?.(null);
          }
        }
      };

      if (e.target?.result) img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);

    setTimeout(() => {
      event.target.value = "";
    }, 0);
  };

  return (
    <div className={Styles.ImageInput}>
      {error && <p className={Styles.errorMsg}>{error}</p>}

      <label htmlFor="image-upload" className={Styles.uploadLabel}>
        {!preview ? (
          <>
            <LuImagePlus className={Styles.icon} size={30} />
            <p>{lable}</p>
          </>
        ) : (
          <div className={Styles.previewContainer}>
            <Image
              src={preview}
              alt="معاينة الصورة"
              loading="lazy"
              width={100}
              height={100}
              unoptimized
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
            <p style={{ marginTop: "8px", textAlign: "center" }}>{lable}</p>
          </div>
        )}
      </label>

      <input
        type="file"
        id="image-upload"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
    </div>
  );
}

export default ImagInputComponent;
