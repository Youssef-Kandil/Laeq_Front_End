"use client";

import React, { useState,useRef, ChangeEvent } from "react";
import styles from "./FileInputComponent.module.css";
import { FiUploadCloud } from "react-icons/fi";

interface FileInputComponentProps {
  /**
   * Callback بيرجع لك كل الملفات الصالحة
   */
  onFilesChange?: (files: File[]) => void;
  /**
   * أقصى حجم للملف بالميجا بايت (افتراضى 10)
   */
  maxFileSizeMB?: number;
}

const FileInputComponent: React.FC<FileInputComponentProps> = ({
  onFilesChange,
  maxFileSizeMB = 10,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const partitionFiles = (arr: File[], limit: number) => {
    const valid: File[] = [];
    const rejected: File[] = [];

    arr.forEach((file) => {
      const sizeMB = file.size / (1024 * 1024);
      (sizeMB <= limit ? valid : rejected).push(file);
    });

    return { valid, rejected };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    const { valid, rejected } = partitionFiles(selected, maxFileSizeMB);

    if (rejected.length) {
      alert(
        `بعض الملفات تعدت ${maxFileSizeMB}MB وتم تجاهلها:\n${rejected
          .map((f) => f.name)
          .join("\n")}`
      );
    }

    const updatedFiles = [...files, ...valid];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Reset value علشان تقدر تختار نفس الملف تانى لو حبيت
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  return (
    <div className={styles.container}>
        
        {files.length === 0 && (<section className={styles.section}>
            <FiUploadCloud size={40} color="rgba(0, 0, 0, 0.4)"/>
            <label htmlFor="file-input" className={styles.label}>
                Select a file or drag and drop here
                <p className={styles.emptyState}>
                    JPG, PNG or PDF, file size no more than {maxFileSizeMB}MB
                </p>
            </label>
        </section>
            )}
       {files.length === 0 &&(
            <button type="button" onClick={handleButtonClick} className={styles.select_btn}>
                Select File
            </button>
        )}

      <input
        ref={inputRef}
        id="file-input"
            className={styles.input}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            onChange={handleChange}
        />


      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, idx) => (
            <li key={idx} className={styles.fileItem}>
              <span>{file.name}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeFile(idx)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default FileInputComponent;
