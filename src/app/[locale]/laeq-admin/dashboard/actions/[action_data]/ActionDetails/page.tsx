"use client";
import React, { useState } from "react";
import Styles from "./actionDetails.module.css";
import { InputComponent, MultimageInputComponent } from "@/app/components/global/InputsComponents";
import { useRouter, useParams } from "next/navigation";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import encryption from "@/app/utils/encryption";
import { useAddActionDetails , useGetActionDataByID } from "@/app/Hooks/useActions";
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon from "@/app/Lottie/wrong.json";
import LoadingIcon from "@/app/Lottie/Loading animation blue.json";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";
import { Badge } from "@/app/components/ui/badge"

function ActionDetails() {
  const router = useRouter();
  const params = useParams();
  const { action_data } = params;

  let decryptedActionId: string | undefined = undefined;

  const info = getAdminAccountInfo("AccountInfo");
  const isEmployee = info?.role === "employee";

  const targetId = isEmployee ? info?.userDetails?.admin_id : info?.userDetails?.id;

  // ==========================
  //  SAFE BASE64 DECODING FIX
  // ==========================
  function safeBase64Decode(str: string) {
    try {
      const cleaned = decodeURIComponent(str); // Important Fix
      // return Buffer.from(cleaned, "base64").toString("utf8");
      return cleaned
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

  const [id] = (decryptedActionId ?? "").split("-");

  const [comment, setComment] = useState<string>("");
  const [image, setImage] = useState<Blob>();
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [ErrorPopupMSG, setErrorPopupMSG] = useState<{ title: string; subTitle: string }>({
    title: "",
    subTitle: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const { mutate: addActionDetails } = useAddActionDetails();
  const { data, isLoading,isError } = useGetActionDataByID({id:Number(id)??-1,admin_id:Number(targetId)??-1});
  if (isLoading) return <SkeletonLoader/>
  if (isError) return <p>Error</p>
  if (!data) return <p>Error</p>


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
        <MultimageInputComponent
          label=""
          placeholder="upload action image"
          max_images={1}
          onChange={(_, blobs) => setImage(blobs[0])}
        />

        <InputComponent disabled label="Action Title" placeholder="Action Title" value={data?.action_title} onTyping={() => {}} />

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
