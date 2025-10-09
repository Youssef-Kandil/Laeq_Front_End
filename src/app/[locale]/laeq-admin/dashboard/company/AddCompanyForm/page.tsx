"use client";
import React, { useState } from "react";
import Styles from "./AddCompanyForm.module.css";

import { useRouter } from "next/navigation";

import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";
import DropListComponent from "@/app/components/global/InputsComponents/DropListComponent/DropListComponent";
import LocationInputComponent from "@/app/components/global/InputsComponents/LocationInputComponent/LocationInputComponent";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import { useCreateCompany } from "@/app/Hooks/useCompany";
import { useGetCompaniesByUserId } from '@/app/Hooks/useCompany';
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import { DropListType } from "@/app/Types/DropListType";
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'



// ✅ نوع الـ Site اللي هيخش في الـ Payload
export interface siteType {
  admin_id: number;
  site_name: string;
  site_license:string;
  full_address: string;
  post_code: string;
  lat: string;
  long: string;
}

function AddCompanyForm() {
  const router = useRouter();

  const AdminInfo = getAdminAccountInfo("AccountInfo");
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [ErrorPopupMSG, setErrorPopupMSG] = useState<{title:string,subTitle:string}>({title:"",subTitle:""});
  const [loading,setLoading] = React.useState<boolean>(false);
  const limits = AdminInfo?.userDetails?.admin_account_limits ?? {max_branches:0};
  const [maxBranches] = useState(limits?.max_branches?? 0); 
  // const [currentCompanies] = useState(1); // شركة واحدة حالياً
// خطة المستخدم
  const [sites, setSites] = useState<siteType[]>([
    {
      admin_id: AdminInfo?.userDetails.id??0,
      site_name: "",
      site_license:"",
      full_address: "",
      post_code: "",
      lat: "",
      long: "",
    },
  ]);
  
  const [companyName, setCompanyName] = useState<string>("");
  const [companySector, setCompanySector] = useState<DropListType|null>(null);
  const [companyLicense, setCompanyLicense] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [companyWebSite, setCompanyWebSite] = useState<string>("");

  const { mutate } = useCreateCompany();
  const { data, isLoading, error } = useGetCompaniesByUserId(AdminInfo?.userDetails.id??0);
          if (isLoading) return <div>Loading...</div>;
          if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
          if (!data) return <div>لا توجد بيانات</div>;
          console.warn("data LLLL",data)


  const handleAddSite = () => {
    setSites((prev) => [
      ...prev,
      {
        admin_id: AdminInfo?.userDetails.id??0,
        site_name: "",
        site_license:"",
        full_address: "",
        post_code: "",
        lat: "",
        long: ""
      },
    ]);
    if (sites.length < maxBranches) {
    }
  };

  const handleDeleteSite = (index: number) => {
    setSites((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSite = (index: number, updatedSite: Partial<siteType>) => {
    setSites((prev) =>
      prev.map((site, i) =>
        i === index ? { ...site, ...updatedSite } : site
      )
    );
  };

  const handel_createNewCompany = () => {
    setLoading(true);
    if (
      companyName.length == 0
      ||companyEmail.length == 0
      ||companySector?.value.length == 0
      ||sites[0].site_name.length == 0
      ||sites[0].site_license.length == 0
      ||sites[0].full_address.length == 0
      ||sites[0].post_code.length == 0
      ||sites[0].lat.length == 0
      ||sites[0].long.length == 0

     ) {
      setLoading(false);
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Error",
        subTitle:"Complete you Brand data",
      })
        return false
    }
      mutate({
        admin_id: AdminInfo?.userDetails.id??0, // or use the correct admin_id value
        company_name: companyName,
        company_email: companyEmail,
        company_website: companyWebSite,
        company_license:companyLicense,
        sector_type: companySector?.value ?? "", 
        sites,
      },
       { 
          onSuccess: () => {
            router.back()
          },
          onError:()=>{
            setLoading(false);
            setShowErrorPopup(true);
            setErrorPopupMSG({
              title:"Error",
              subTitle:"Failed to add brand",
            })
          }
         }
    );
  };

  return (
    <div>
      {loading&&<Popup
          icon={
            <Lottie
            animationData={LoadingIcon}
            loop={true}
            style={{ width: 350, height: 250 }}
          />
          } 
          title={"loading..."} 
          subTitle=" " 
          onClose={()=>{}}/>}



      {showErrorPopup&&<Popup 
        icon={ 
          <Lottie
            animationData={WorngIcon}
            loop={false}
            style={{ width: 350, height: 250 }}
          />
        } 
        title={ErrorPopupMSG.title}
        subTitle={ErrorPopupMSG.subTitle}
        btnTitle="OK" 
        btnFunc={()=>{
          setShowErrorPopup(false);
        }} 
        onClose={()=>{
          setShowErrorPopup(false);
        }} />}

        {/* ==== ADD Company FORM ==== */}
      <div style={{ padding: "20px 30px" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            background: "#fff",
            padding: "20px 30px",
            borderBottom: "1px solid #eee",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, color: "#444", fontSize: "14px" }}>
                Companies in your plan
              </p>
              <strong style={{ fontSize: "16px", color: "#08ab95" }}>
                {maxBranches} / {Number(data?.length??0)}
              </strong>
            </div>
          </div>
          <BottonComponent title="Save" onClick={handel_createNewCompany} />
        </header>

        {/* Company Info */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            columnGap: 30,
            marginTop: "30px",
            padding: "20px 30px",
          }}
        >
          <InputComponent
            label="Company name*"
            placeholder="Please enter your company name"
            value={companyName}
            onTyping={(txt) => setCompanyName(txt)}
          />
          <DropListComponent
            label="Sector type*"
            placeholder="Please enter your Sector type"
            onSelect={(txt) => setCompanySector(txt)}
            list={[
              { id: 1, value: "Restaurant" ,title: "Restaurant"},
              { id: 2, value: "Hotel" ,title:"Hotel"},
              { id: 3, value: "Supermarket",title:"Supermarket" },
              { id: 4, value: "Factory",title:  "Factory",},
              { id: 5, value: "Coffee shop",title:  "Coffee shop",},
              { id: 6, value: "Hospitality",title:  "Hospitality",},
              { id: 7, value: "Other" ,title:"Other"}
            ]}
          />
          <InputComponent
            label="Company email*"
            placeholder="Please enter your company email"
            value={companyEmail}
            onTyping={(txt) => setCompanyEmail(txt)}
          />
          <InputComponent
            label="Website"
            placeholder="Https://"
            value={companyWebSite}
            onTyping={(txt) => setCompanyWebSite(txt)}
          />
          <InputComponent
            label="license"
            type="number"
            placeholder="Please enter your company license number"
            value={companyLicense}
            onTyping={(txt) => setCompanyLicense(txt)}
          />
        </section>

        {/* Dynamic Sites */}
        {sites.map((site, index) => (
          <SiteFormComponent
            key={index}
            index={index + 1}
            site={site}
            onDelete={() => handleDeleteSite(index)}
            onUpdate={(updated) => handleUpdateSite(index, updated)}
          />
        ))}

        {/* Add Site Button */}
          <button
            className={Styles.addSiteButton}
            type="button"
            onClick={handleAddSite}
          >
            + Add New Site
          </button>
        {/* {sites.length < maxBranches && (
          <button
            className={Styles.addSiteButton}
            type="button"
            onClick={handleAddSite}
          >
            + Add New Site
          </button>
        )} */}
      </div>
    </div>
  );
}

export default AddCompanyForm;

// ----------------------------

interface SiteFormComponentProps {
  index: number;
  site: siteType;
  onDelete: () => void;
  onUpdate: (updated: Partial<siteType>) => void;
}

function SiteFormComponent({
  index,
  site,
  onDelete,
  onUpdate,
}: SiteFormComponentProps) {
  return (
    <div className={Styles.SiteFormComponent}>
      <div className={Styles.header}>
        <h3 style={{ marginBottom: "15px" ,fontWeight:"bold"}}>{index == 1?"Main Site*":`Company site ${index}`}</h3>
        {index != 1 && (
          <span className={Styles.deleteButton} onClick={onDelete}>
            ×
          </span>
        )}
      </div>

      <InputComponent
        label="Site Name"
        placeholder="Enter site name"
        value={site.site_name}
        onTyping={(txt) => onUpdate({ site_name: txt })}
      />
      <InputComponent
          label="license"
          placeholder="Please enter your site license number"
          value={site.site_license}
          onTyping={(txt) => onUpdate({ site_license: txt })}
      />
      <InputComponent
        label="Full Address"
        placeholder="Enter full address"
        value={site.full_address}
        onTyping={(txt) => onUpdate({ full_address: txt })}
      />
      <InputComponent
        label="Post Code"
        placeholder="Enter post code"
        value={site.post_code}
        onTyping={(txt) => onUpdate({ post_code: txt })}
      />
      <LocationInputComponent
        label="Site Location*"
        placeholder="Please enter your Site Location"
        value={{ lat: site.lat, long: site.long }}
        onChange={(val) => onUpdate({ lat: val.lat, long: val.long })}
      />
    </div>
  );
}
