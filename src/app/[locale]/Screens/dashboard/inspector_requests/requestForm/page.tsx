"use client";
import React from 'react';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
// import {useLocale} from 'next-intl';
import { useRouter } from "next/navigation"; 
// import { SelectChangeEvent } from '@mui/material';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import { useGetCompaniesByUserId } from '@/app/Hooks/useCompany';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import { DropListType } from '@/app/Types/DropListType';
import { AccountInfo } from '@/app/Types/AccountsType';
import { useAddInspectorRequest } from '@/app/Hooks/useInspectorRequest';
import { inspectorRequestType } from '@/app/Types/inspector_request_Type';
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
// import Styles from './settings.module.css'

function RequestForm() {
    // const current_lang = useLocale();
    const router = useRouter();
    const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const isEmployee = info?.role === "employee";
    const admin_id = isEmployee? 
    info?.userDetails?.admin_id ?? -1
    : info?.userDetails?.id ?? -1;
    // const limits = info?.userDetails?.admin_account_limits;
    const Companies = useGetCompaniesByUserId(info?.userDetails.id ?? 0);
    const {mutate:newRequest,isPending} = useAddInspectorRequest();
    const [isSubmitLoading,setIsSubmiLoading] = React.useState<boolean>(false);
    const [showValidationPopup,setShowValidationPopup] = React.useState<boolean>(false);
    const [ValidationPopupMSG,setValidationPopupMSG] = React.useState<string>("");
    const [sitesList,setSitesList] = React.useState<DropListType[]|null>(null)
    // const pathname = usePathname();
    const CompaniesList = Companies.data?.map((item:{id:number,company_name:string}) => ({
      id: item.id,
      value: String(item.id),
      title: item.company_name,
    }));

    const [selectedCompany,setSelectedCompany] = React.useState<DropListType|null>(null)
    const [selectedSite,setSelectedSite] = React.useState<DropListType|null>(null)
    const [disabled,setDisabled] = React.useState<boolean>(false)

    function getSitesByCompanyId(companyId:number) {
      const company = Companies.data.find((c :{id:number}) => c.id === companyId);
      const SitesList = company.sites?.map((item:{id:number,site_name:string}) => ({
        id: item.id,
        value: item.id,
        title: item.site_name,
      }));

      return company ? SitesList : [];
    }

    function handelSelectCompany(company:DropListType){
        setSelectedCompany(company);    
        setSitesList(getSitesByCompanyId(company.id))
    }

    function handelSendNewRequest(){
        if (!admin_id) return;
        if (!selectedCompany?.value) return;
        if (!selectedSite?.value) return;
        setIsSubmiLoading(true);
        setDisabled(isPending);
        const payload:inspectorRequestType = {
              admin_id:Number(admin_id)??-1,
              company_id:Number(selectedCompany?.value)??-1,
              site_id:Number(selectedSite?.value)??-1,
              status:"Pending"
        }
        console.log("Request Payload ::" ,payload);
        newRequest(payload,{
          onSuccess:()=>{
            router.back();
          },
          onError:(e)=>{
            console.error("Requested ERROR >> ",e);
            setIsSubmiLoading(false)
            setDisabled(false);
            setShowValidationPopup(true);
            setValidationPopupMSG("try again.");
          },
        })
    }

  return (
    <div>
          {isSubmitLoading&&<Popup
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
            {showValidationPopup&&<Popup icon={<Lottie animationData={WorngIcon} loop={false} style={{ width: 350, height: 250 }}/>} title="Wrong!" subTitle={ValidationPopupMSG} onClose={()=>setShowValidationPopup(false)}/>}
      <div style={{
          margin:'12px 10px'
      }}>
        <div style={{display:"flex",flexDirection:'column',gap:30}}>
          <div style={{minWidth:300,width:250}}>
              <DropListComponent label='Company' placeholder='Choose your Company' list={CompaniesList??[]}  onSelect={(val)=>{handelSelectCompany(val)}}/>
          </div>
          <div style={{minWidth:300,width:250}}>
            <DropListComponent label='Site' placeholder='Choose your Site'  list={sitesList ?? []}  onSelect={(val)=>{setSelectedSite(val)}}/>
          </div>
          


        </div>

        <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              margin: '20px 10px' ,
          }}>
          <div style={{flex:1}}>
            <BottonComponent disabled={disabled} title='Send Request' onClick={handelSendNewRequest}/>
          </div>
          <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
        </div>
        
      </div>
    </div>
  )
}

export default RequestForm
