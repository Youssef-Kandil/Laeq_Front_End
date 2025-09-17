/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import Modal from "react-modal";
import Styles from "./SignatureInputComponent.module.css";
import { FaTrashAlt } from "react-icons/fa";
// import Image from "next/image";

interface Props {
  label: string;
  placeholder: string;
  onChange: (value: Blob | null) => void; // ✅ بقينا نرجع Blob بدل string
  value: Blob | null; // ✅ القيمة دلوقتي Blob
}

export default function SignatureInputComponent({
  label,
  placeholder,
  onChange,
  value,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sigPadRef = useRef<SignaturePad | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveSignature = () => {
    const sigPad = sigPadRef.current;
    if (sigPad && !sigPad.isEmpty()) {
      sigPad.getTrimmedCanvas().toBlob((blob) => {
        if (blob) {
          onChange(blob); // ✅ رجع Blob للأب
        }
        closeModal();
      }, "image/webp"); // 👈 نحفظ كـ WebP
    }
  };

  const clearSignature = () => {
    sigPadRef.current?.clear();
  };

  const deleteSignature = () => {
    onChange(null); // ✅ نحذف التوقيع
  };

  return (
    <div className={Styles.signatureBox}>
      <label className={Styles.label}>{label}</label>

      <div
        className={Styles.field}
        onClick={openModal}
        style={{ cursor: "pointer", position: "relative" }}
      >
        {value ? (
          <div style={{ maxHeight: "100px", maxWidth: "300px", position: "relative" }}>
            <img
              src={URL.createObjectURL(value)} // ✅ حول Blob → URL
              alt="التوقيع"
              // fill
              style={{ objectFit: "contain" }}
            />
            <button
              className={Styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                deleteSignature();
              }}
            >
              <FaTrashAlt color="#ef4444" />
            </button>
          </div>
        ) : (
          <span style={{ color: "#888" }}>{placeholder}</span>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="رسم التوقيع"
        ariaHideApp={false}
        style={{
          content: {
            inset: "15%",
            borderRadius: "12px",
            overflow: "hidden",
            padding: 0,
            maxHeight: 300,
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          },
        }}
      >
        <div style={{ padding: "16px" }}>
          <SignaturePad
            ref={sigPadRef}
            canvasProps={{ width: 300, height: 200, className: Styles.signatureCanvas }}
          />
        </div>

        <div className={Styles.buttonsContainer}>
          <button onClick={clearSignature} className={Styles.clearBtn}>مسح</button>
          <button onClick={closeModal} className={Styles.cancelBtn}>إلغاء</button>
          <button onClick={saveSignature} className={Styles.saveBtn}>حفظ</button>
        </div>
      </Modal>
    </div>
  );
}
