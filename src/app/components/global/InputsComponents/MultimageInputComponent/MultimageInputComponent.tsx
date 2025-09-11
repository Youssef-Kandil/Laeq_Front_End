"use client";
import React from 'react';
import { LuImagePlus } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import Styles from './MultimageInputComponent.module.css';
import { resizeAndConvert } from '@/app/utils/imageHelpers';
import Image from 'next/image';

interface Props {
  label: string;
  placeholder:string;
  onChange?: (previews: string[], blobs: Blob[]) => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export default function MultimageInputComponent({
  label,
  placeholder,
  onChange,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.8,
}: Props) {
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [blobs, setBlobs]    = React.useState<Blob[]>([]);
  const [error, setError]    = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;

  React.useEffect(() => {
    if (onChange) onChange(previews, blobs);
  }, [previews, blobs, onChange]);

  const openFilePicker = () => {
    if (previews.length < MAX_IMAGES) inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const slots = MAX_IMAGES - previews.length;
    const toProcess = Array.from(files).slice(0, slots);

    const newPreviews: string[] = [];
    const newBlobs: Blob[]      = [];

    for (const file of toProcess) {
      try {
        const webpBlob = await resizeAndConvert(file, maxWidth, maxHeight, quality);
        newBlobs.push(webpBlob);
        newPreviews.push(URL.createObjectURL(webpBlob));
      } catch {
        // تجاهل الملف لو فيه خطأ
      }
    }

    if (newPreviews.length === 0) {
      setError("لم يتم قبول أي صور (تحقق من الحجم أو الأبعاد).");
    } else {
      setError(null);
      setBlobs(prev => [...prev, ...newBlobs]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setBlobs(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={Styles.ImageInput}>
      {error && <p className={Styles.errorMsg}>{error}</p>}
          <p>{label}</p>
      <section className={Styles.holder} onClick={openFilePicker}>
        <label>
          <LuImagePlus size={30} />
          <p>{placeholder}</p>
          <p>{previews.length} / {MAX_IMAGES}</p>
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </section>

      <section className={Styles.grid}>
        <div className={Styles.ImagesContainer}>
          {previews.map((src, i) => (
            <div key={i} className={Styles.previewBox}>
              <div className={Styles.deleteIcon} onClick={() => removeImage(i)}>
                <RiDeleteBinLine size={20} color='red'/>
              </div>
              <Image src={src} alt={`Preview ${i + 1}`} width={100} height={100} loading='lazy'  />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
