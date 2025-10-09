/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRouter,useParams } from "next/navigation";
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


import { useUpdateAsset,useAssetsData } from "@/app/Hooks/useAssets";
import { useGetCompaniesByUserId } from "@/app/Hooks/useCompany";
import { AssetsType } from "@/app/Types/AssetsType";
import { DropListType } from "@/app/Types/DropListType";
import { AccountInfo } from "@/app/Types/AccountsType";
import ImagePreviewPopup from "@/app/components/global/ImagePreviewPopup/ImagePreviewPopup";

function EditAssetForm() {
  const router = useRouter();
  const {Asset_id} = useParams();
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
  const { mutate: EditeAsset } = useUpdateAsset();

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

  const { data, isLoading, error } = useAssetsData(Number(Asset_id)??-1);
  React.useEffect(() => {
    if (data) {
      // 🖼️ Parse الصورة (لأنها راجعة JSON string)
      let parsedImg: any = "";
      try {
        parsedImg = data.asset_img ? JSON.parse(data.asset_img) : "";
      } catch (err) {
        parsedImg = data.asset_img ?? "";
        console.error(err)
      }
  
      setAsset({
        asset_name: data.asset_name ?? "",
        asset_category: data.asset_category ?? "",
        brand: data.brand ?? "",
        model: data.model ?? "",
        warranty_date: data.warranty_date ?? "",
        last_maintenance_date: data.last_maintenance_date ?? "",
        next_maintenance_date: data.next_maintenance_date ?? "",
        color: data.color ?? "",
        serial_number: data.serial_number ?? "",
        description: data.description ?? "",
        asset_img:  "", // 🖼️ خليها الـ URL عشان يبان في الـ preview
        file_name:parsedImg?.fileName || ""
      });
  
      // 🏢 Company & Site
      setCompany(data.companies?.id ?? -1);
      const sitesListByCompany = getSitesByCompanyId(data.companies?.id ?? -1);
      setSitesList(sitesListByCompany);
      setSite(data.sites?.id ?? -1);
    }
  }, [data]);
  
      if (isLoading) return <div>Loading...</div>;
      if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
      if (!data) return <div>لا توجد بيانات</div>;
      console.warn("data LLLL",data)

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

    // if (!asset.asset_img) {
    //   showError("Wrong!", "Asset must have a image");
    //   return;
    // }
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
      id:Number(Asset_id)??-1,
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
      file_name:asset?.file_name || ""
    };
    console.log("Assets payload :: ",payload)

    EditeAsset(payload, {
      onSuccess: () => {
        setLoading(false);
        setShowPopup(true);
        router.back();
      },
      onError: () => {
        showError("Failed to  Edit asset", "An error occurred while saving. Please try again.");
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
        <div style={{ marginBottom: "30px",display:"flex",flexDirection:'column',gap:30,alignItems:"center",justifyContent:"flex-end",width:"fit-content"}}>
            <ImagInputComponent
              lable="Asset Image"
              defaultValue={String(data.asset_img ? JSON.parse(data.asset_img).fileUrl : "")??""}
              onChange={(file) => setAsset((prev) => ({ ...prev, asset_img: file }))}
            />
            {asset.asset_img == ""&&<ImagePreviewPopup url={String(data.asset_img ? JSON.parse(data.asset_img).fileUrl : "") ?? ""} />}

        </div>


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
            defaultOption={{id:data.companies.id,title:data.companies.company_name??"",value:data.companies.company_name??""}}
            list={CompaniesList}
            onSelect={(el) => handelSelectCompany(el)}
          />
          <DropListComponent
            label="Site"
            placeholder="Choose your Site"
            defaultOption={{id:data.sites.id,title:data.sites.site_name??"",value:data.sites.site_name??""}}
            list={sitesList ?? []}
            onSelect={(el) => setSite(el.id)}
          />
          <DropListComponent
            label="Warranty"
            placeholder="Choose Warranty"
            defaultOption={{id:0,title:asset.warranty_date??"",value:asset.warranty_date??""}}
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
            defaultValue={asset.last_maintenance_date}            
              onChange={(date) => setAsset((prev) => ({ ...prev, last_maintenance_date: date }))}
            />
          </div>
          <div>
            <label>Next maintenance date</label>
            <DateInputComponent
              defaultValue={asset.next_maintenance_date}
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

        <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "30px 10px" }}>
          <div style={{ flex: 1 }}>
            <BottonComponent title="Edit" onClick={handleSubmit} />
          </div>
          <p onClick={() => router.back()} style={{ flex: 5, cursor: "pointer" }}>
            Cancel
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditAssetForm;