/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import ImagInputComponent from "@/app/components/global/InputsComponents/ImagInputComponent/ImagInputComponent";
import { DateInputComponent } from "@/app/components/global/InputsComponents";

import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";
import DropListComponent from "@/app/components/global/InputsComponents/DropListComponent/DropListComponent";
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WrongIcon from "@/app/Lottie/wrong.json";
import LoadingIcon from "@/app/Lottie/Loading animation blue.json";

import { useAddNewAsset } from "@/app/Hooks/useAssets";
import { useGetCompaniesByUserId } from "@/app/Hooks/useCompany";
import { AssetsType } from "@/app/Types/AssetsType";
import { DropListType } from "@/app/Types/DropListType";
import { AccountInfo } from "@/app/Types/AccountsType";

function AddAssetForm() {
  const router = useRouter();
  const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
  const isEmployee = info?.role === "employee";
  const AdminID = isEmployee ? info?.userDetails?.admin_id : info?.userDetails?.id;

  // ====== States ======
  const [asset, setAsset] = React.useState<Partial<AssetsType>>({});
  const [company, setCompany] = React.useState<number>(-1);
  const [site, setSite] = React.useState<number>(-1);
  const [sitesList, setSitesList] = React.useState<DropListType[] | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [showErrorPopup, setShowErrorPopup] = React.useState(false);
  const [errorPopupMSG, setErrorPopupMSG] = React.useState<{ title: string; subTitle: string }>({
    title: "",
    subTitle: "",
  });

  // ====== Hooks ======
  const Companies = useGetCompaniesByUserId(info?.userDetails?.id ?? 0);
  const { mutate: addNewAsset } = useAddNewAsset();

  // ====== Lists ======
  const CompaniesList =
    Companies.data?.map((item: { id: number; company_name: string; sites: any[] }) => ({
      id: item.id,
      value: String(item.id),
      title: item.company_name,
    })) ?? [];

  function getSitesByCompanyId(companyId: number) {
    const company = Companies.data?.find((c: { id: number }) => c.id === companyId);
    const SitesList =
      company?.sites?.map((item: { id: number; site_name: string }) => ({
        id: item.id,
        value: item.id,
        title: item.site_name,
      })) ?? [];
    return company ? SitesList : [];
  }

  function handelSelectCompany(company: DropListType) {
    setCompany(company.id);
    setSitesList(getSitesByCompanyId(company.id));
  }

  // ====== Submit ======
  function handleSubmit() {
    setLoading(true);

    if (!asset.asset_name || asset.asset_name.trim().length === 0) {
      showError("Wrong!", "Asset must have a name");
      return;
    }
    if (!asset.color || asset.color.trim().length === 0) {
      showError("Wrong!", "Asset must have a Color");
      return;
    }
    if (!asset.brand || asset.brand.trim().length === 0) {
      showError("Wrong!", "Asset must have a brand");
      return;
    }
    if (!asset.model || asset.model.trim().length === 0) {
      showError("Wrong!", "Asset must have a model");
      return;
    }
    if (!asset.serial_number || asset.serial_number.trim().length === 0) {
      showError("Wrong!", "Asset must have a serial");
      return;
    }
    if (!asset.warranty_date || asset.warranty_date.trim().length === 0) {
      showError("Wrong!", "Asset must have a warranty");
      return;
    }

    if (!asset.asset_img) {
      showError("Wrong!", "Asset must have a image");
      return;
    }
    if (!asset.last_maintenance_date || asset.last_maintenance_date.trim().length === 0) {
      showError("Wrong!", "Asset must have a last maintenance date");
      return;
    }
    if (!asset.asset_category || asset.asset_category.trim().length === 0) {
      showError("Wrong!", "Asset must have a  category ");
      return;
    }

    if (company === -1) {
      showError("Wrong!", "Must Select Company");
      return;
    }
    if (site === -1) {
      showError("Wrong!", "Must Select Site");
      return;
    }
    if (!AdminID) {
      showError("Wrong!", "Re-login and try again later!");
      return;
    }

    const payload: AssetsType = {
      asset_name: asset.asset_name ?? "",
      asset_category: asset.asset_category ?? "",
      brand: asset.brand ?? "",
      model: asset.model ?? "",
      warranty_date: asset.warranty_date ?? "",
      last_maintenance_date: asset.last_maintenance_date ?? "",
      next_maintenance_date: asset.next_maintenance_date ?? "",
      color: asset.color ?? "",
      serial_number: asset.serial_number ?? "",
      description: asset.description ?? "",
      company_id: company,
      site_id: site,
      admin_id: AdminID ?? -1,
      asset_img: asset.asset_img ?? "",
    };
    console.log("Assets payload :: ",payload)

    addNewAsset(payload, {
      onSuccess: () => {
        setLoading(false);
        setShowPopup(true);
        router.back();
      },
      onError: () => {
        showError("Failed to add asset", "An error occurred while saving. Please try again.");
      },
    });
  }

  // ====== Error handler ======
  function showError(title: string, subTitle: string) {
    setLoading(false);
    setShowErrorPopup(true);
    setErrorPopupMSG({ title, subTitle });
  }

  // ====== Render ======
  return (
    <div>
      {loading && (
        <Popup
          icon={<Lottie animationData={LoadingIcon} loop={true} style={{ width: 350, height: 250 }} />}
          title={"Loading..."}
          subTitle=" "
          onClose={() => {}}
        />
      )}

      {showPopup && (
        <Popup
          title={"Congratulations!"}
          subTitle="Your Asset has been added successfully."
          btnTitle="Go To Assets List"
          btnFunc={() => {
            setShowPopup(false);
          }}
          onClose={() => {}}
        />
      )}

      {showErrorPopup && (
        <Popup
          icon={<Lottie animationData={WrongIcon} loop={false} style={{ width: 150, height: 150 }} />}
          title={errorPopupMSG.title}
          subTitle={errorPopupMSG.subTitle}
          btnTitle="Ok"
          btnFunc={() => {
            setShowErrorPopup(false);
          }}
          onClose={() => {
            setShowErrorPopup(false);
          }}
        />
      )}

      <div style={{ marginLeft: "30px", marginRight: "30px" }}>
        <ImagInputComponent
          lable="Asset Image"
          onChange={(file) => setAsset((prev) => ({ ...prev, asset_img: file }))}
        />

        <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 900, alignItems: "center", gap: 20 }}>
          <InputComponent
            label="Asset name"
            placeholder="Please enter asset name"
            value={asset.asset_name ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, asset_name: txt }))}
          />
          <InputComponent
            label="Model"
            placeholder="Enter model"
            value={asset.model ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, model: txt }))}
          />
          <InputComponent
            label="Category"
            placeholder="Enter asset category"
            value={asset.asset_category ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, asset_category: txt }))}
          />
          <InputComponent
            label="Brand"
            placeholder="Enter brand"
            value={asset.brand ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, brand: txt }))}
          />
          <InputComponent
            label="Serial number"
            placeholder="Enter serial number"
            value={asset.serial_number ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, serial_number: txt }))}
          />
          <InputComponent
            label="Color"
            placeholder="Enter color"
            value={asset.color ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, color: txt }))}
          />

          <DropListComponent
            label="Company"
            placeholder="Choose your Company"
            list={CompaniesList}
            onSelect={(el) => handelSelectCompany(el)}
          />
          <DropListComponent
            label="Site"
            placeholder="Choose your Site"
            list={sitesList ?? []}
            onSelect={(el) => setSite(el.id)}
          />
          <DropListComponent
            label="Warranty"
            placeholder="Choose Warranty"
            list={[
              { id: 1, title: "1 Year", value: "1 Year" },
              { id: 2, title: "2 Years", value: "2 Years" },
              { id: 3, title: "3 Years", value: "3 Years" },
              { id: 4, title: "5 Years", value: "5 Years" },
              { id: 5, title: "10 Years", value: "10 Years" },
              { id: 6, title: "More than 10 Years", value: "More than 10 Years" },
            ]}
            onSelect={(el) => setAsset((prev) => ({ ...prev, warranty_date: el.value }))}
          />

          <div>
            <label>Last maintenance date</label>
            <DateInputComponent
              onChange={(date) => setAsset((prev) => ({ ...prev, last_maintenance_date: date }))}
            />
          </div>
          <div>
            <label>Next maintenance date</label>
            <DateInputComponent
              onChange={(date) => setAsset((prev) => ({ ...prev, next_maintenance_date: date }))}
            />
          </div>
        </div>

        <InputComponent
          isTextArea
          label="Description"
          placeholder="Enter description"
          value={asset.description ?? ""}
          onTyping={(txt) => setAsset((prev) => ({ ...prev, description: txt }))}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "0px 10px" }}>
          <div style={{ flex: 1 }}>
            <BottonComponent title="Save Asset" onClick={handleSubmit} />
          </div>
          <p onClick={() => router.back()} style={{ flex: 5, cursor: "pointer" }}>
            Cancel
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddAssetForm;
