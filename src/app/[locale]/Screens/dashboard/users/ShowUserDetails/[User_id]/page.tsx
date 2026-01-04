/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from 'react'

//You@Laeq123
import { useRouter , useParams } from "next/navigation";
// import { useLocale } from "next-intl"; 
// import { SelectChangeEvent } from '@mui/material';
import { useGetCompaniesByUserId } from '@/app/Hooks/useCompany';
import { useGetEmployeeDataByID } from '@/app/Hooks/useEmployees';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';

import { DropListType } from '@/app/Types/DropListType';
import { AccountInfo } from '@/app/Types/AccountsType';
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from 'lottie-react';
import ErrorIcon from '@/app/Lottie/wrong.json'


function ShowUserDetails() {

    // const current_lang = useLocale();
    const router = useRouter();
    // const local = useLocale();
    const {User_id} = useParams();


    const AdminInfo = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const Companies = useGetCompaniesByUserId(AdminInfo?.userDetails.id ?? 0);


    const {data} = useGetEmployeeDataByID(Number(User_id) ?? -1);


    const [,setSitesList] = React.useState<DropListType[]|null>(null)

    const [selectedCompany,setSelectedCompany] = React.useState<DropListType|null>(null)
    const [selectedSite,setSelectedSite] = React.useState<DropListType|null>(null)
    const [selectedRole,setSelectedRole] = React.useState<DropListType|null>(null)
    const [full_name,setFull_Name] = React.useState<string|null>(null)
    const [email,setEmail] = React.useState<string|null>(null)
    const [password,setPassword] = React.useState<string|null>(null)
    const [jobTitle,setJobTitle] = React.useState<string|null>(null)
    const [phone,setPhone] = React.useState<string|null>(null)

    React.useEffect(()=>{
        if (data) {
          setFull_Name(data.full_name ?? "");
          setEmail(data.users.email ?? "");
          setPhone(data.phone ?? "");
          setJobTitle(data.job_title ?? "");
          setPassword(data.users.password ?? ""); // نخليها فاضية عشان لو عايز يغير
          setSelectedCompany({
            id: data.companies.id,
            value: String(data.companies.id),
            title: data.companies.company_name,
          });
          setSitesList(getSitesByCompanyId(data.companies.id));
          setSelectedSite({
            id: data.sites.id,
            value: String(data.sites.id),
            title: data.sites.site_name,
          });
          setSelectedRole({
            id: data.roles.id,
            value: String(data.roles.id),
            title: data.roles.role_name,
          });
        }
      }, [data]);
      

    

    function getSitesByCompanyId(companyId:number) {
      const company = Companies.data?.companies?.find((c :{id:number}) => c.id === companyId);
      const SitesList = company.sites?.map((item:{id:number,site_name:string}) => ({
        id: item.id,
        value: item.id,
        title: item.site_name,
      }));


      return company ? SitesList : [];
    }

    const [showErrorPopup,setShowErrorPopup] = React.useState<boolean>(false);
    const [ErrorPopupMSG,] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});




    

  return (
    <div>
      {showErrorPopup&&<Popup icon={<Lottie animationData={ErrorIcon}  style={{ width: 350, height: 250 }} loop={true}/>} title={ErrorPopupMSG.title} subTitle={ErrorPopupMSG.subTitle} onClose={()=>setShowErrorPopup(false)}/>}
    <div style={{margin:"30px"}}>
        <div style={{display:'flex',flexWrap:"wrap",maxWidth:900,alignItems:"center",gap:20}}>
            <InputComponent disabled label='Fullname' placeholder='Please enter your fullname' value={full_name ?? ''} onTyping={(txt)=>{setFull_Name(txt)}}/>
            <InputComponent disabled label='Email' placeholder='Please enter your email' value={email?? ''} onTyping={(txt)=>{setEmail(txt)}}/>
            <InputComponent disabled label='Phone number' placeholder='Please enter your phone number' value={phone?? ''} onTyping={(txt)=>{setPhone(txt)}}/>
            <InputComponent disabled label='Job title' placeholder='Please enter your job title' value={jobTitle?? ''} onTyping={(txt)=>{setJobTitle(txt)}}/>
            <InputComponent disabled label='Password' placeholder='Please enter your password' value={password?? ''} onTyping={(txt)=>{setPassword(txt)}}/>
            <InputComponent disabled label='Company' placeholder='Please enter your Company' value={selectedCompany?.title?? ''} onTyping={(txt)=>{setPassword(txt)}}/>
            <InputComponent disabled label='Role' placeholder='Please enter your Role' value={selectedRole?.title?? ''} onTyping={(txt)=>{setPassword(txt)}}/>
            <InputComponent disabled label='Site' placeholder='Please enter your Site' value={selectedSite?.title?? ''} onTyping={(txt)=>{setPassword(txt)}}/>

        </div>

      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '20px 10px 0px 10px' ,
        }}>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Back</p>
      </div>
    </div>
    </div>
  )
}

export default ShowUserDetails
