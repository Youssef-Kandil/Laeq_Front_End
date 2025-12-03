/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import Modal from "react-modal";
import Styles from "./SignatureInputComponent.module.css";
import { FaTrashAlt } from "react-icons/fa";

interface Props {
  label: string;
  placeholder: string;
  onChange: (value: Blob | null) => void;
  value: Blob | null;
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
  try {
    const sigPad = sigPadRef.current;
    if (sigPad && !sigPad.isEmpty()) {
      // ✅ استخدم getCanvas بدل getTrimmedCanvas
      const canvas = sigPad.getCanvas();

      if (canvas.toBlob) {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              onChange(blob);
            }
            closeModal();
          },
          "image/webp",
          1
        );
      } else {
        const dataUrl = canvas.toDataURL("image/webp");
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            onChange(blob);
            closeModal();
          });
      }
    }
  } catch (error) {
    console.error("Error saving signature:", error);
  }
};


  const clearSignature = () => {
    sigPadRef.current?.clear();
  };

  const deleteSignature = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange(null);
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
          <div
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              position: "relative",
              overflow:"hidden"
            }}
          >
            <img
              src={URL.createObjectURL(value)}
              alt="التوقيع"
              style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
            />
            <button
              type="button"
              className={Styles.deleteBtn}
              onClick={deleteSignature}
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
        ariaHideApp={false}
        contentLabel="رسم التوقيع"
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
            margin: "auto",
          },
        }}
      >
        <div style={{ padding: "16px" }}>
          <SignaturePad
            ref={sigPadRef}
            canvasProps={{
              width: 300,
              height: 200,
              className: Styles.signatureCanvas,
            }}
          />
        </div>

        <div className={Styles.buttonsContainer}>
          <button
            type="button"
            onClick={clearSignature}
            className={Styles.clearBtn}
          >
            مسح
          </button>
          <button
            type="button"
            onClick={closeModal}
            className={Styles.cancelBtn}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={saveSignature}
            className={Styles.saveBtn}
          >
            حفظ
          </button>
        </div>
      </Modal>
    </div>
  );
}
