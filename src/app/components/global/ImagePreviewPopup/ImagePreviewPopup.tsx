/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

function ImagePreviewPopup({ url }: { url: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        style={{ color: "#0070f3", cursor: "pointer", border: "#0070f3 solid 1px" ,padding:"10px 15px" }}
      >
        Preview Image
      </span>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // يمنع قفل البوباب لو ضغطت جوه الصورة
            style={{
              background: "white",
              padding: "10px",
              borderRadius: "8px",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <img
              src={url}
              alt="Asset Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                minWidth:"300px",
                minHeight:"300px",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ImagePreviewPopup;
