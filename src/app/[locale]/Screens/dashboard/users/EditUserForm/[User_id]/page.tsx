/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from 'react'

//You@Laeq123
import { useRouter , useParams } from "next/navigation";
// import { useLocale } from "next-intl"; 
// import { SelectChangeEvent } from '@mui/material';
import { useGetCompaniesByUserId } from '@/app/Hooks/useCompany';
import { useRole } from '@/app/Hooks/useRole';
import { useGetEmployeeDataByID ,useEditeEmployee} from '@/app/Hooks/useEmployees';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
import { DropListType } from '@/app/Types/DropListType';
import { AccountInfo } from '@/app/Types/AccountsType';
import regex from '@/app/utils/regex';
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from 'lottie-react';
import ErrorIcon from '@/app/Lottie/wrong.json'


function EditUserForm() {

    // const current_lang = useLocale();
    const router = useRouter();
    // const local = useLocale();
    const {User_id} = useParams();


    const AdminInfo = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const Companies = useGetCompaniesByUserId(AdminInfo?.userDetails.id ?? 0);
    const Roles = useRole(AdminInfo?.userDetails.id ?? 0);
    const { mutate ,isPending} = useEditeEmployee();
    const {data} = useGetEmployeeDataByID(Number(User_id) ?? -1);

    const CompaniesList = Companies.data.companies?.map((item:{id:number,company_name:string}) => ({
      id: item.id,
      value: String(item.id),
      title: item.company_name,
    }));
    const RolesList = Roles.data?.map((item:{id:number,role_name:string}) => ({
      id: item.id,
      value: String(item.id),
      title: item.role_name,
    }));

    const [sitesList,setSitesList] = React.useState<DropListType[]|null>(null)

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
      const company = Companies?.data?.companies.find((c :{id:number}) => c.id === companyId);
      const SitesList = company?.sites?.map((item:{id:number,site_name:string}) => ({
        id: item.id,
        value: item.id,
        title: item.site_name,
      }));


      return company ? SitesList : [];
    }

    const [showErrorPopup,setShowErrorPopup] = React.useState<boolean>(false);
    const [ErrorPopupMSG,setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});

    function handelSelectCompany(company:DropListType){
            setSelectedCompany(company);    
            setSitesList(getSitesByCompanyId(company.id));
    }

    function handelValidation(){
      if (!full_name) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add Full Name"
        });
        return false;
      }
      if (!email) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add  Email"
        });
        return false; 
      }
      if (email === AdminInfo?.email) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Duplcate Email"
        });
        return false; 
      }
      if(!regex.email.test(email)){
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add Valid Email"
        });
        return false;
      }
      if (!password) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add  Password"
        });
        return false;
        
      }

      if(!regex.password.test(password)){
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"unValid Password!",
          subTitle: "at least (8 characters, uppercase letter, lowercase letter, number, and special character)*"
        });
        return false;
      }
      if (!jobTitle) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add Job title"
        });
        return false;
        
      }
      if (phone == null) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must phone number"
        });
        return false;  
        
      }
      if (selectedCompany == null) {
          setShowErrorPopup(true);
          setErrorPopupMSG({
            title:"warn!",
            subTitle:"Must Select Company"
          });
          return false;
        
      }
      if (!selectedSite) {
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Select Site"
        });
        return false;
        
      }
      if (!selectedRole) {
          setShowErrorPopup(true);
          setErrorPopupMSG({
            title:"warn!",
            subTitle:"Must Select Role"
          })
          return false;     
      }

      return true;

    }


    const handelSubmitEmpData = ()=>{

          if (handelValidation()){
                mutate({
                  id:Number(data.users.id)??-1,
                  admin_id:AdminInfo?.userDetails.id ?? -1,
                  email: email ?? "",
                  password: password ?? "",
                  job_title: jobTitle ?? "",
                  full_name:full_name ?? "",
                  phone:phone??"",
                  role:"employee",
                  role_id:selectedRole?.id??-1,
                  company_id:selectedCompany?.id??-1,
                  site_id:selectedSite?.id??-1,
                  is_active:0,
                },
                { 
                  onSuccess: () => {
                    router.back();
                  },
                  onError:(error:any)=>{
                    const backendError =
                    error?.response?.data?.error || // لو راجع من السيرفر
                    error?.message ||               // لو جا من React Query
                    "Something went wrong"; 
                    console.log("backendError ",backendError);    // fallback
                    setShowErrorPopup(true);
                    setErrorPopupMSG({
                      title:"warn!",
                      subTitle: backendError,
                    });
                  }
                }
              )
          }

    }
    
    console.log(Companies.data)
  return (
    <div>
      {showErrorPopup&&<Popup icon={<Lottie animationData={ErrorIcon}  style={{ width: 350, height: 250 }} loop={true}/>} title={ErrorPopupMSG.title} subTitle={ErrorPopupMSG.subTitle} onClose={()=>setShowErrorPopup(false)}/>}
    <div style={{margin:"30px"}}>
        <div style={{display:'flex',flexWrap:"wrap",maxWidth:900,alignItems:"center",gap:20}}>
            <InputComponent label='Fullname' placeholder='Please enter your fullname' value={full_name ?? ''} onTyping={(txt)=>{setFull_Name(txt)}}/>
            <InputComponent label='Email' placeholder='Please enter your email' value={email?? ''} onTyping={(txt)=>{setEmail(txt)}}/>
            <InputComponent label='Phone number' placeholder='Please enter your phone number' value={phone?? ''} onTyping={(txt)=>{setPhone(txt)}}/>
            <InputComponent label='Job title' placeholder='Please enter your job title' value={jobTitle?? ''} onTyping={(txt)=>{setJobTitle(txt)}}/>
            <InputComponent label='Password' placeholder='Please enter your password' value={password?? ''} onTyping={(txt)=>{setPassword(txt)}}/>
            <DropListComponent defaultOption={selectedCompany??{id:0,title:"",value:""}} label='Company' placeholder='Choose your Company' list={CompaniesList??[]}  onSelect={(val)=>{handelSelectCompany(val)}}/>
            {/* <DropListComponent label='Department' placeholder='Choose your Departnment' list={[]}  onSelect={()=>{}}/> */}
            <DropListComponent defaultOption={selectedRole??{id:0,title:"",value:""}} label='Role' placeholder='Choose your Role' list={RolesList??[]}  onSelect={(val)=>{setSelectedRole(val)}}/>
            <DropListComponent defaultOption={selectedSite??{id:0,title:"",value:""}} label='Site' placeholder='Choose your Site'  list={sitesList ?? []}  onSelect={(val)=>{setSelectedSite(val)}}/>
        </div>

      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '20px 10px 0px 10px' ,
        }}>
        <div style={{flex:1}}>
          <BottonComponent disabled={isPending} onClick={handelSubmitEmpData} title='Edit'/>
        </div>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
      </div>
    </div>
    </div>
  )
}

export default EditUserForm
