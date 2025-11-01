/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRouter,useParams } from "next/navigation";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import ImagInputComponent from "@/app/components/global/InputsComponents/ImagInputComponent/ImagInputComponent";
import { DateInputComponent } from "@/app/components/global/InputsComponents";

import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";





import { useAssetsData } from "@/app/Hooks/useAssets";
import { useGetCompaniesByUserId } from "@/app/Hooks/useCompany";
import { AssetsType } from "@/app/Types/AssetsType";
import { DropListType } from "@/app/Types/DropListType";
import { AccountInfo } from "@/app/Types/AccountsType";
import ImagePreviewPopup from "@/app/components/global/ImagePreviewPopup/ImagePreviewPopup";


function ShowAssetDetails() {
  const router = useRouter();
  const {Asset_id} = useParams();
  const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
//   const isEmployee = info?.role === "employee";
//   const AdminID = isEmployee ? info?.userDetails?.admin_id : info?.userDetails?.id;
 
  // ====== States ======
  const [asset, setAsset] = React.useState<Partial<AssetsType>>({});
  const [, setCompany] = React.useState<number>(-1);
  const [, setSite] = React.useState<number>(-1);
  const [, setSitesList] = React.useState<DropListType[] | null>(null);



  // ====== Hooks ======
  const Companies = useGetCompaniesByUserId(info?.userDetails?.id ?? 0);


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





  // ====== Render ======
  return (
    <div>


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
            disabled
            label="Asset name"
            placeholder="Please enter asset name"
            value={asset.asset_name ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, asset_name: txt }))}
          />
          <InputComponent
            disabled
            label="Model"
            placeholder="Enter model"
            value={asset.model ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, model: txt }))}
          />
          <InputComponent
            disabled
            label="Category"
            placeholder="Enter your category"
            value={ asset.asset_category?? ""}
            onTyping={()=>{}}
          />

          <InputComponent
            disabled
            label="Brand"
            placeholder="Enter brand"
            value={asset.brand ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, brand: txt }))}
          />
          <InputComponent
            disabled
            label="Serial number"
            placeholder="Enter serial number"
            value={asset.serial_number ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, serial_number: txt }))}
          />
          <InputComponent
            disabled
            label="Color"
            placeholder="Enter color"
            value={asset.color ?? ""}
            onTyping={(txt) => setAsset((prev) => ({ ...prev, color: txt }))}
          />


        <InputComponent
            disabled
            label="Company"
            placeholder="Enter your Company"
            value={ data.companies.company_name?? ""}
            onTyping={()=>{}}
          />
        <InputComponent
            disabled
            label="Site"
            placeholder="Enter your Site"
            value={ data.sites.site_name?? ""}
            onTyping={()=>{}}
          />

        <InputComponent
            disabled
            label="Warranty"
            placeholder="Enter your Warranty"
            value={ asset.warranty_date?? ""}
            onTyping={()=>{}}
          />


          <div>
            <label>Last maintenance date</label>
            <DateInputComponent 
            disabled       
            defaultValue={asset.last_maintenance_date}            
              onChange={(date) => setAsset((prev) => ({ ...prev, last_maintenance_date: date }))}
            />
          </div>
          <div>
            <label>Next maintenance date</label>
            <DateInputComponent
            disabled
              defaultValue={asset.next_maintenance_date}
              onChange={(date) => setAsset((prev) => ({ ...prev, next_maintenance_date: date }))}
            />
          </div>
        </div>

        <InputComponent
          disabled
          isTextArea
          label="Description"
          placeholder="Enter description"
          value={asset.description ?? ""}
          onTyping={(txt) => setAsset((prev) => ({ ...prev, description: txt }))}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "30px 10px" }}>
          <p onClick={() => router.back()} style={{ flex: 5, cursor: "pointer" }}>
            Back
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShowAssetDetails;