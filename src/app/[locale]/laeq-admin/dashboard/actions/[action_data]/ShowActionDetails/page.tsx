/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Styles from "./showActionDetails.module.css";
import { InputComponent } from "@/app/components/global/InputsComponents";
import { useRouter, useParams } from "next/navigation";
import encryption from "@/app/utils/encryption";
import { useGetActionDetails } from "@/app/Hooks/useActions";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import ImagePreviewPopup from "@/app/components/global/ImagePreviewPopup/ImagePreviewPopup";
import { LuImageOff } from "react-icons/lu";
import { Badge } from "@/app/components/ui/badge"

function ShowActionDetails() {
  const router = useRouter();
  const params = useParams();
  const { action_data } = params;

  let decryptedActionId: string | undefined = undefined;

  // ==========================
  //  SAFE BASE64 DECODING FIX
  // ==========================
  function safeBase64Decode(str: string) {
    try {
      const cleaned = decodeURIComponent(str);
      // return Buffer.from(cleaned, "base64").toString("utf8");
      return cleaned;
    } catch {
      return "";
    }
  }

  if (typeof action_data === "string") {
    const decoded = safeBase64Decode(action_data);
    decryptedActionId = encryption.decryption(decoded, "encryptionKey");
    console.log("action_data --> ", decryptedActionId);
  } else if (Array.isArray(action_data) && action_data.length > 0) {
    const decoded = safeBase64Decode(action_data[0]);
    decryptedActionId = encryption.decryption(decoded, "encryptionKey");
  }

  const info = getAdminAccountInfo("AccountInfo");
  const isEmployee = info?.role === "employee";

  const targetId = isEmployee ? info?.userDetails?.admin_id : info?.userDetails?.id;
  const [id,] = (decryptedActionId ?? "").split("-");

  const [comment, setComment] = useState<string>("");

  const { data, isError, isLoading } = useGetActionDetails({
    id: Number(id ?? -1),
    admin_id: Number(targetId ?? -1),
  });


  useEffect(() => {
    setComment(data?.comment ?? "");
  }, [data]);

  // ===== Loading / Error States =====
  if (isLoading) return <SkeletonLoader />;
  if (isError) return <p className="text-red-500">❌ Error loading actions</p>;

  return (
    <div>
      {/* === START Form === */}
      <div className={Styles.parent}>
        {/* === START Form Header === */}
        <div className={Styles.titles}>
          <h2>
            Action Details <span>Overview</span>
          </h2>
          <p>
            These are the final action details securely stored and fully encrypted for your privacy
          </p>
          <Badge 
            className={`
              h-5 min-w-5 rounded-full px-3 font-mono tabular-nums 
              ${data?.importance_level === "High" ? "bg-red-300 text-red-700 border-red-500" : ""}
              ${data?.importance_level === "Medium" ? "bg-yellow-300 text-yellow-700 border-yellow-500" : ""}
              ${data?.importance_level === "Low" ? "bg-green-300 text-green-700 border-green-500" : ""}
            `}
          variant="outline">
            {data?.importance_level}
          </Badge>
        </div>

        {/* === START INPUTS === */}
        {data?.img ? (
          <div className={Styles.ImageBOX}>
            <img src={data.img} alt="" loading="lazy"/>
            <ImagePreviewPopup url={String(data.img) ?? ""} />
          </div>
        ) : (
          <div className={Styles.noImage}>
            <p><LuImageOff style={{fontSize:20}}/> No Image Uploaded</p>
          </div>
        )}

        <InputComponent
          disabled
          label="Action Title"
          placeholder="Action Title"
          value={data?.action_title}
          onTyping={() => {}}
        />
        <InputComponent
          disabled
          isTextArea
          label="Comment"
          placeholder="Action Comment"
          value={comment}
          onTyping={() => {}}
        />

        {/* === START Buttons === */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "20px",
            margin: "0px 10px",
          }}
        >
          <p onClick={() => router.back()} style={{ flex: 5, cursor: "pointer" }}>
            Back
          </p>
        </div>
      </div>
      {/* === End Form === */}
    </div>
  );
}

export default ShowActionDetails;
