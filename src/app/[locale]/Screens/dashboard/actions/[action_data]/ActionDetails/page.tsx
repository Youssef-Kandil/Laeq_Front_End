"use client";
import React, { useState } from "react";
import Styles from "./actionDetails.module.css";
import { InputComponent, MultimageInputComponent } from "@/app/components/global/InputsComponents";
import { useRouter, useParams } from "next/navigation";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import encryption from "@/app/utils/encryption";
import { useAddActionDetails } from "@/app/Hooks/useActions";
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon from "@/app/Lottie/wrong.json";
import LoadingIcon from "@/app/Lottie/Loading animation blue.json";

function ActionDetails() {
  const router = useRouter();
  const params = useParams();
  const { action_data } = params;

  let decryptedActionId: string | undefined = undefined;

  // ==========================
  //  SAFE BASE64 DECODING FIX
  // ==========================
  function safeBase64Decode(str: string) {
    try {
      const cleaned = decodeURIComponent(str); // Important Fix
      return Buffer.from(cleaned, "base64").toString("utf8");
    } catch {
      return "";
    }
  }

  if (typeof action_data === "string") {
    const base64decoded = safeBase64Decode(action_data);
    decryptedActionId = encryption.decryption(base64decoded, "encryptionKey");
    console.log("action_data --> ", decryptedActionId);
  } else if (Array.isArray(action_data) && action_data.length > 0) {
    const base64decoded = safeBase64Decode(action_data[0]);
    decryptedActionId = encryption.decryption(base64decoded, "encryptionKey");
  }

  const [id, Action_Title] = (decryptedActionId ?? "").split("-");

  const [comment, setComment] = useState<string>("");
  const [image, setImage] = useState<Blob>();
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [ErrorPopupMSG, setErrorPopupMSG] = useState<{ title: string; subTitle: string }>({
    title: "",
    subTitle: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const { mutate: addActionDetails } = useAddActionDetails();

  function handeleSubmet() {
    setLoading(true);
    if (!id || !comment) {
      setLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({ title: "Wrong!", subTitle: "Missing Data" });
      return;
    }
    if (comment?.trim()?.length == 0) {
      setLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({ title: "Wrong!", subTitle: "Action must have a comment" });
      return;
    }

    addActionDetails(
      {
        id: Number(id ?? -1),
        action_img: image ?? null,
        comment: comment,
      },
      {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          setLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({
            title: "Failed to add Action Details",
            subTitle: "An error occurred while saving. Please try again.",
          });
        },
      }
    );
  }

  return (
    <div>
      {/* === START Popups === */}
      {loading && (
        <Popup
          icon={<Lottie animationData={LoadingIcon} loop={true} style={{ width: 350, height: 250 }} />}
          title={"loading..."}
          subTitle=" "
          onClose={() => {}}
        />
      )}

      {showErrorPopup && (
        <Popup
          icon={<Lottie animationData={WorngIcon} loop={false} style={{ width: 150, height: 150 }} />}
          title={ErrorPopupMSG.title}
          subTitle={ErrorPopupMSG.subTitle}
          btnTitle="Ok"
          btnFunc={() => {
            setShowErrorPopup(false);
          }}
          onClose={() => {
            setShowErrorPopup(false);
          }}
        />
      )}

      {/* === START Form === */}
      <div className={Styles.parent}>
        {/* === START Form Header === */}
        <div className={Styles.titles}>
          <h2>
            Last step to finish <span>Action</span>
          </h2>
          <p>Now you need to send some details</p>
        </div>

        {/* === START INPUTS === */}
        <MultimageInputComponent
          label=""
          placeholder="upload action image"
          max_images={1}
          onChange={(_, blobs) => setImage(blobs[0])}
        />

        <InputComponent disabled label="Action Title" placeholder="Action Title" value={Action_Title} onTyping={() => {}} />

        <InputComponent
          isTextArea
          label="Comment *"
          placeholder="Action Comment"
          value={comment}
          onTyping={(txt) => setComment(txt)}
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
          <BottonComponent title="Finish" onClick={handeleSubmet} />
          <p
            onClick={() => router.back()}
            style={{ flex: 5, cursor: "pointer" }}
          >
            Cancel
          </p>
        </div>
      </div>
      {/* === End Form === */}
    </div>
  );
}

export default ActionDetails;
