/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState ,useEffect } from "react";
import Styles from "./ShowAssetDetails.module.css";

import {useRouter, useParams} from "next/navigation";
// import { useLocale } from "next-intl";
import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";
import LocationInputComponent from "@/app/components/global/InputsComponents/LocationInputComponent/LocationInputComponent";

import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import { DropListType } from "@/app/Types/DropListType";
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { useGetCompanyDataByID  } from '@/app/Hooks/useCompany';
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";

// import { number } from "framer-motion";

// ✅ نوع الـ Site اللي هيخش في الـ Payload
export interface siteType {
  id?:number;
  admin_id: number;
  site_name: string;
  site_license:string;
  full_address: string;
  post_code: string;
  lat: string;
  long: string;
}

function ShowCompanyDetails() {
  const router = useRouter();
  // const local = useLocale();
  const {Company_id} = useParams();
  const AdminInfo = getAdminAccountInfo("AccountInfo");
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [ErrorPopupMSG, ] = useState<{title:string,subTitle:string}>({title:"",subTitle:""});
  const [loading,] = React.useState<boolean>(false);
  // const [currentCompanies] = useState(1); // شركة واحدة حالياً
// خطة المستخدم
  const [sites, setSites] = useState<siteType[]>([
    {
      admin_id: AdminInfo?.userDetails.id??-1,
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


  // const { mutate:deleteCompany , isPending:loadingDeleteCompany } = useDeleteCompany();

  const { data, isLoading, error } = useGetCompanyDataByID(Number(Company_id)??-1);
      useEffect(() => {
        if (data) {
          setCompanyName(data.company_name ?? "");
          setCompanyEmail(data.company_email ?? "");
          setCompanyWebSite(data.company_website ?? "");
          setCompanyLicense(data.company_license ?? "");
          setCompanySector(data.sector_type ? { id: 0, value: data.sector_type, title: data.sector_type } : null);
      
          // set sites
          if (data.sites && data.sites.length > 0) {
            setSites(
              data.sites.map((site: any) => ({
                id:site.id,
                admin_id: site.admin_id,
                company_id:site.company_id,
                site_name: site.site_name,
                site_license: site.site_license,
                full_address: site.full_address,
                post_code: site.post_code,
                lat: site.lat,
                long: site.long,
              }))
            );
          }
        }
      }, [data]);
          if (isLoading) return <SkeletonLoader />;
          if (error) return <div>حدث خطأ: {(error as Error).message}</div>;
          if (!data) return <div>لا توجد بيانات</div>;
          console.warn("data LLLL",data)






  






  // const handel_DeleteCompany =()=>{
  //       if(Company_id){
  //         deleteCompany({id:Number(Company_id)??-1},{
  //           onSuccess:()=>{
  //             router.back()
  //           },
  //           onError:()=>{
  //             setShowErrorPopup(true);
  //             setErrorPopupMSG({
  //               title:"Wrong",
  //               subTitle:"Failed to Delete brand",
  //             })             
  //           }
  //         })
  //       }else{

  //       }
  // }


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

        {/* ==== Update Company FORM ==== */}
      <div style={{ padding: "20px 30px" }}>
        {/* Header */}

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
            disabled
            label="Company name*"
            placeholder="Please enter your company name"
            value={companyName}
            onTyping={(txt) => setCompanyName(txt)}
          />
          <InputComponent
            disabled
            label="Sector type*"
            placeholder="Please enter your Sector type"
            value={companySector?.value??""}
            onTyping={(txt) => setCompanyName(txt)}
          />
          <InputComponent
            disabled
            label="Company email*"
            placeholder="Please enter your company email"
            value={companyEmail}
            onTyping={(txt) => setCompanyEmail(txt)}
          />
          <InputComponent  
            disabled
            label="Website"
            placeholder="Https://"
            value={companyWebSite}
            onTyping={(txt) => setCompanyWebSite(txt)}
          />
          <InputComponent
            disabled
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
          />
        ))}

        {/* back Button */}
          <button
            className={Styles.addSiteButton}
            type="button"
            onClick={()=>router.back()}
          >
            Back
          </button>
        {/* {sites.length < maxBranches && (
        )} */}
      </div>
    </div>
  );
}

export default ShowCompanyDetails;

// ----------------------------

interface SiteFormComponentProps {
  index: number;
  site: siteType;
}

function SiteFormComponent({
  index,
  site,
}: SiteFormComponentProps) {
  const isNew = !site.id;
  console.log("isNew : ",isNew);
  console.log("site.id : ",site);
  return (
    <div className={Styles.SiteFormComponent}>
      <div className={Styles.header}>
        <h3 style={{ marginBottom: "15px" ,fontWeight:"bold"}}>{index == 1?"Main Site*":`Company site ${index}`}</h3>
      </div>

      <InputComponent
        disabled
        label="Site Name"
        placeholder="Enter site name"
        value={site.site_name}
        onTyping={() => {}}
      />
      <InputComponent
          disabled
          label="license"
          placeholder="Please enter your site license number"
          value={site.site_license}
          onTyping={() => {}}
      />
      <InputComponent
        disabled
        label="Full Address"
        placeholder="Enter full address"
        value={site.full_address}
        onTyping={() => {}}
      />
      <InputComponent
        disabled
        label="Post Code"
        placeholder="Enter post code"
        value={site.post_code}
        onTyping={() => {}}
      />
      <LocationInputComponent
        disabled
        label="Site Location*"
        placeholder="Please enter your Site Location"
        value={{ lat: site.lat, long: site.long }}
        // onChange={(val) => onUpdate({ lat: val.lat, long: val.long })}
        onChange={() => {}}
      />

    </div>
  );
}
