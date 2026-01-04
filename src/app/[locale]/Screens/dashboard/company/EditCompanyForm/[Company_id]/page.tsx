/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState ,useEffect } from "react";
import Styles from "./EditCompanyForm.module.css";

import { useRouter,useParams} from "next/navigation";
// import { useLocale } from "next-intl";
import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";
import DropListComponent from "@/app/components/global/InputsComponents/DropListComponent/DropListComponent";
import LocationInputComponent from "@/app/components/global/InputsComponents/LocationInputComponent/LocationInputComponent";
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import { getAdminAccountInfo } from "@/app/utils/getAccountInfo";
import { DropListType } from "@/app/Types/DropListType";
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { RiDeleteBinLine } from "react-icons/ri";
import { useGetCompanyDataByID ,useUpdateCompany } from '@/app/Hooks/useCompany';
import {useCreateSite,useUpdateSite,useDeleteSite} from '@/app/Hooks/useSites';
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

function EditCompanyForm() {
  const router = useRouter();
  // const local = useLocale();
  const {Company_id} = useParams();
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
  const [loadingSiteAction, setLoadingSiteAction] = useState<number | null>(null); 

  const { mutate:EditeCompany , isPending:updateingCompany } = useUpdateCompany();
  // const { mutate:deleteCompany , isPending:loadingDeleteCompany } = useDeleteCompany();
  const { mutate: createSite } = useCreateSite();
  const { mutate:EditeSite} = useUpdateSite();
  const { mutate:deleteSite} = useDeleteSite();
  const { data, isLoading, error } = useGetCompanyDataByID(Number(Company_id)??-1);
      useEffect(() => {
        if (data) {
          setCompanyName(data.companyData.company_name ?? "");
          setCompanyEmail(data.companyData.company_email ?? "");
          setCompanyWebSite(data.companyData.company_website ?? "");
          setCompanyLicense(data.companyData.company_license ?? "");
          setCompanySector(data.companyData.sector_type ? { id: 0, value: data.companyData.sector_type, title: data.companyData.sector_type } : null);
      
          // set sites
          if (data.companyData.sites && data.companyData.sites.length > 0) {
            setSites(
              data.companyData.sites.map((site: any) => ({
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


  const handleAddSite = () => {
    setSites((prev) => [
      ...prev,
      {
        company_id:Number(Company_id)??-1,
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

  const handleSaveNewSite = (newSite: siteType,index:number) => {
    setLoading(true);
    setLoadingSiteAction(index);
    createSite(newSite, {
      onSuccess: (createdSite:any) => {
        setLoading(false);
        console.log("✅ Site created successfully");
        // تحديث الـ site بالـ id اللي رجع من الـ API
        setSites((prev) =>
          prev.map((site, i) =>
            i === index ? { ...site, id: createdSite.id } : site
          )
        );
        setLoadingSiteAction(null);
      },
      onError: () => {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title: "Wrong!",
          subTitle: "Failed to Create Site",
        });
        setLoadingSiteAction(null);
      },
    });
  };

  const handleDeleteSite = (index: number,id:number,isID:boolean) => {
    setLoading(true);
    if (isID) {
      deleteSite({id:id},{onSuccess:()=>{setLoading(false);},onError:()=>{setLoading(false);}})
    }
    setSites((prev) => prev.filter((_, i) => i !== index));
    setLoading(false);
  };

  const handleUpdateSite = ( index: number, id: number, isID: boolean, updatedSite: Partial<siteType>, saveToAPI: boolean = false) => {
    // Update local state
    setLoading(true);
    setSites((prev) =>
      prev.map((site, i) =>
        i === index ? { ...site, ...updatedSite } : site
      )
    );
  
    // لو ضغط Save → نعمل API Call
    if (isID && saveToAPI) {
      if (
        typeof updatedSite?.admin_id === "number" 
        && typeof id === "number" 
        && updatedSite?.site_name?.trim() != ""
        && updatedSite?.site_license?.trim() != ""
        && updatedSite?.post_code?.trim() != ""
        && updatedSite?.full_address?.trim() != "" 
        && updatedSite?.lat?.trim() != "" 
        && updatedSite?.long?.trim() != "" ) {
        setLoadingSiteAction(index);
        EditeSite(
          {
            ...updatedSite,
            id: id,
            admin_id: updatedSite.admin_id,
          } as siteType,
          {
            onSuccess: () => {
              setLoading(false);
              console.log("✅ Site updated successfully");
              setLoadingSiteAction(null);
            },
            onError: () => {
              setLoading(false);
              setShowErrorPopup(true);
              setErrorPopupMSG({
                title: "Wrong!",
                subTitle: "Failed to Update Site",
              });
              setLoadingSiteAction(null);
            },
          }
        );
      }else{
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title: "Missing Data!",
          subTitle: "Failed to Update Site",
        });
      }
    }else{
      setLoading(false);
    }
  };
  

  const handel_EditCompany = () => {
    if (
      companyName.length == 0
      ||Company_id == undefined
      ||companyEmail.length == 0
      ||companyLicense.length == 0
      ||companySector?.value.length == 0
     ) {
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Error",
        subTitle:"Complete you Branche data",
      })
        return false
    }
    EditeCompany({
        id:Number(Company_id)??-1,
        admin_id: AdminInfo?.userDetails.id??-1, // or use the correct admin_id value
        company_name: companyName,
        company_email: companyEmail,
        company_website: companyWebSite,
        company_license:companyLicense,
        sector_type: companySector?.value ?? "", 
        sites:[],
      },
       { 
          onSuccess: () => {
            router.back()
          },
          onError:()=>{
            setShowErrorPopup(true);
            setErrorPopupMSG({
              title:"Wrong",
              subTitle:"Failed to Edit Branche",
            })
          }
         }
    );
  };




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
            label="Company name*"
            placeholder="Please enter your company name"
            value={companyName}
            onTyping={(txt) => setCompanyName(txt)}
          />
          <DropListComponent
            label="Sector type*"
            placeholder="Please enter your Sector type"
            onSelect={(txt) => setCompanySector(txt)}
            defaultOption={companySector??{id:0,value:"",title:""}}
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
          <div style={{width:"100%",display:"flex",gap:10}}>
              {/* <BottonComponent disabled={loadingDeleteCompany} title="Delete" onClick={handel_DeleteCompany}/>  */}
              <BottonComponent disabled={updateingCompany} title="Edit" onClick={handel_EditCompany}/> 
          </div>
        </section>

        {/* Dynamic Sites */}
        {sites.map((site, index) => (
          <SiteFormComponent
            key={index}
            index={index + 1}
            loading={loadingSiteAction === index}
            site={site}
            onDelete={() => handleDeleteSite(index,   site?.id?site.id:index,   site?.id?true:false)}
            onUpdate={(updated) =>
              handleUpdateSite(index, site?.id ? site.id : index, site?.id ? true : false, updated)
            }
            onSaveUpdate={(updated) =>
              handleUpdateSite(index, site?.id ? site.id : index, site?.id ? true : false, updated, true)
            }
            onAddNew={(newSite) => handleSaveNewSite(newSite,index)}
          />
        ))}

        {/* Add Site Button */}
        {data.totalSites < maxBranches && (
          <button
            className={Styles.addSiteButton}
            type="button"
            onClick={handleAddSite}
          >
            + Add New Site
          </button> 
        )}
      </div>
    </div>
  );
}

export default EditCompanyForm;

// ----------------------------

interface SiteFormComponentProps {
  index: number;
  site: siteType;
  loading: boolean;
  onDelete: () => void;
  onUpdate: (updated: Partial<siteType>) => void;
  onSaveUpdate: (updated: Partial<siteType>) => void;
  onAddNew: (newSite: siteType) => void; // ✅ جديد
}

function SiteFormComponent({
  index,
  site,
  loading,
  onDelete,
  onUpdate,
  onSaveUpdate,
  onAddNew
}: SiteFormComponentProps) {
  const isNew = !site.id;
  console.log("isNew : ",isNew);
  console.log("site.id : ",site);
  return (
    <div className={Styles.SiteFormComponent}>
      <div className={Styles.header}>
        <h3 style={{ marginBottom: "15px" ,fontWeight:"bold"}}>{index == 1?"Main Site*":`Company site ${index}`}</h3>
        {index != 1 && (
          <span className={Styles.deleteButton} onClick={onDelete}>
            <RiDeleteBinLine/>
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
      {isNew ? (
        <BottonComponent
        title={loading ? "Adding..." : "Add"}
        disabled={loading}
          onClick={() =>
            onAddNew({
              ...site,
              admin_id: site.admin_id,
            })
          }
        />
      ) : (
        <BottonComponent
        title={loading ? "Saving..." : "Save"}
        disabled={loading}
          onClick={() =>
            onSaveUpdate({
              site_name: site.site_name,
              site_license: site.site_license,
              full_address: site.full_address,
              post_code: site.post_code,
              lat: site.lat,
              long: site.long,
              admin_id: site.admin_id,
            })
          }
        />
      )}
    </div>
  );
}
