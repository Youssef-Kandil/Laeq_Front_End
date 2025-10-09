"use client";
import React from "react";
import { LuImagePlus } from "react-icons/lu";
import Styles from "./imagInputComponent.module.css";
import Image from "next/image";

interface props {
  lable: string;
  defaultValue?: string;
  onChange?: (image: Blob | null) => void;
}

function ImagInputComponent({ lable, defaultValue, onChange }: props) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // ✅ نفك JSON string لو جاي كده
  const parsedDefaultUrl = React.useMemo(() => {
    try {
      if (!defaultValue) return null;
      if (defaultValue.startsWith("{")) {
        const obj = JSON.parse(defaultValue);
        return obj?.fileUrl ?? null;
      }
      return defaultValue; // URL عادي
    } catch {
      return null;
    }
  }, [defaultValue]);

  // ✅ لو فيه defaultValue نحطه في preview
  React.useEffect(() => {
    if (parsedDefaultUrl) {
      setPreview(parsedDefaultUrl);
    }
  }, [parsedDefaultUrl]);

  const convertToWebp = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (!ctx) return reject("Canvas not supported");

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject("Conversion failed");
            },
            "image/webp",
            0.9
          );
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeKB = 4449;
    const maxWidth = 4500;
    const maxHeight = 4500;

    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      setError(`حجم الصورة يجب أن يكون أقل من ${maxSizeKB} كيلوبايت.`);
      setPreview(null);
      onChange?.(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
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
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);

    // ✅ فضي القيمة بعد شوية علشان ما يفتحش الـ picker تاني أول مرة
    setTimeout(() => {
      event.target.value = "";
    }, 0);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className={Styles.ImageInput}>
      {error && <p className={Styles.errorMsg}>{error}</p>}

      {!preview && (
        <label onClick={openFilePicker} htmlFor="image-upload" style={{ cursor: "pointer" }}>
          <LuImagePlus className={Styles.icon} size={30} />
          <p>{lable}</p>
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        id="image-upload"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {preview && (
        <div onClick={openFilePicker}>
          <Image
            src={preview}
            alt="معاينة الصورة"
            loading="lazy"
            width={100}
            height={100}
            unoptimized // 👈 يمنع Next من محاولة تحميل URL invalid
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImagInputComponent;
