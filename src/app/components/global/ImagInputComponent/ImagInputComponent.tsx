"use client";
import React from 'react'
import { LuImagePlus } from "react-icons/lu";
import Styles from './imagInputComponent.module.css'


interface props {
  lable:string;
  defaultValue?:string;
  onChange?: (image: File | null) => void;
  
}

function ImagInputComponent({lable,defaultValue,onChange}:props) {
  // === START STATES ======
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // ==== START LOGIG ====
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeKB = 4449; // الحد الأقصى للحجم بالكيلوبايت
    const maxWidth = 4500; // الحد الأقصى للعرض بالبكسل
    const maxHeight = 4500; // الحد الأقصى للارتفاع بالبكسل

    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      setError(`حجم الصورة يجب أن يكون أقل من ${maxSizeKB} كيلوبايت.`);
      setPreview(null);
      onChange?.(null); // 👈 نبلغ الأب إن الصورة مرفوضة
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          setError(`أبعاد الصورة يجب أن تكون ${maxWidth}×${maxHeight} بكسل أو أقل.`);
          setPreview(null);
          onChange?.(null); // 👈 نبلغ الأب برضو
        } else {
          setError(null);
          setPreview(e.target?.result as string);
          onChange?.(file); // 👈 الصورة سليمة، نديها للأب
        }
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const openFilePicker = () => {
    inputRef.current?.click();
    console.log("openFilePicker")
  };

  // === START RENDER UI 
  return (
    <div className={Styles.ImageInput}>
      {error&&<p className={Styles.errorMsg}>{error}</p>}

      {!preview &&
        <label onClick={openFilePicker}  htmlFor="image-upload" style={{cursor: 'pointer' }}>
          <LuImagePlus className={Styles.icon} size={30} />
          <p>{lable}</p>
        </label>
      }


      <input
        ref={inputRef}
        type="file"
        id="image-upload"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {preview && (
        <div onClick={openFilePicker} style={{}}>
          <img
            src={preview?preview:defaultValue}
            alt="معاينة الصورة"
            loading='lazy'
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px',objectFit:'contain' }}
          />
        </div>
      )}
    </div>
  )
}

export default ImagInputComponent
