"use client";
import React from 'react'

//You@Laeq123
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl"; 
// import { SelectChangeEvent } from '@mui/material';
import { useGetCompaniesByUserId } from '@/app/Hooks/useCompany';
import { useRole } from '@/app/Hooks/useRole';
import { useCreateEmployee ,useEmployees} from '@/app/Hooks/useEmployees';
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
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { FaFlagCheckered } from "react-icons/fa";


function AddUserForm() {

    // const current_lang = useLocale();
    const router = useRouter();
    const local = useLocale();


    const AdminInfo = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const limits = AdminInfo?.userDetails?.admin_account_limits;
    const maxEmployees = limits?.max_users ?? 0;
    const Companies = useGetCompaniesByUserId(AdminInfo?.userDetails.id ?? 0);
    const Roles = useRole(AdminInfo?.userDetails.id ?? 0);
    const { mutate ,isPending} = useCreateEmployee();

    const Employees = useEmployees(AdminInfo?.userDetails.id ?? 0);
    const isFirstTime = localStorage.getItem("first_time");
    const [showFirstPopup, setShowFirstPopup] = React.useState<boolean>(false);
    
    React.useEffect(() => {
      if (!isFirstTime && Employees?.data && Employees?.data?.length === 0) {
        setShowFirstPopup(true);
      } else {
        setShowFirstPopup(false);
      }
    }, [Employees?.data, isFirstTime]);

    const CompaniesList = Companies.data?.map((item:{id:number,company_name:string}) => ({
      id: item.id,
      value: String(item.id),
      title: item.company_name,
    }));
    const RolesList = Roles.data?.map((item:{id:number,role_name:string}) => ({
      id: item.id,
      value: String(item.id),
      title: item.role_name,
    }));

    const [loading,setLoading] = React.useState<boolean>(false);

    const [sitesList,setSitesList] = React.useState<DropListType[]|null>(null)

    const [selectedCompany,setSelectedCompany] = React.useState<DropListType|null>(null)
    const [selectedSite,setSelectedSite] = React.useState<DropListType|null>(null)
    const [selectedRole,setSelectedRole] = React.useState<DropListType|null>(null)
    const [full_name,setFull_Name] = React.useState<string|null>(null)
    const [email,setEmail] = React.useState<string|null>(null)
    const [password,setPassword] = React.useState<string|null>(null)
    const [jobTitle,setJobTitle] = React.useState<string|null>(null)
    const [phone,setPhone] = React.useState<string|null>(null)

    function getSitesByCompanyId(companyId:number) {
      const company = Companies.data.find((c :{id:number}) => c.id === companyId);
      const SitesList = company.sites?.map((item:{id:number,site_name:string}) => ({
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
      setLoading(true);
      if (!full_name) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add Full Name"
        });
        return false;
      }
      if (!email) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add  Email"
        });
        return false; 
      }
      if (email === AdminInfo?.email) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Duplcate Email"
        });
        return false; 
      }
      if(!regex.email.test(email)){
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add Valid Email"
        });
        return false;
      }
      if (!password) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add  Password"
        });
        return false;
        
      }

      if(!regex.password.test(password)){
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"unValid Password!",
          subTitle: "at least (8 characters, uppercase letter, lowercase letter, number, and special character)*"
        });
        return false;
      }
      if (!jobTitle) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Add Job title"
        });
        return false;
        
      }
      if (phone == null) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must phone number"
        });
        return false;  
        
      }
      if (selectedCompany == null) {
        setLoading(false);
          setShowErrorPopup(true);
          setErrorPopupMSG({
            title:"warn!",
            subTitle:"Must Select Company"
          });
          return false;
        
      }
      if (!selectedSite) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"warn!",
          subTitle:"Must Select Site"
        });
        return false;
        
      }
      if (!selectedRole) {
        setLoading(false);
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
                  admin_id:AdminInfo?.userDetails.id ?? 0,
                  email: email ?? "",
                  password: password ?? "",
                  job_title: jobTitle ?? "",
                  full_name:full_name ?? "",
                  phone:phone??"",
                  role:"employee",
                  role_id:selectedRole?.id??0,
                  company_id:selectedCompany?.id??0,
                  site_id:selectedSite?.id??0,
                  is_active:0,
                },
                { 
                  onSuccess: () => {
                    setLoading(false);
                    localStorage.setItem("first_time","1");
                    if (!isFirstTime) {
                      router.replace(`/${local}/Screens/dashboard/checklist`);
                    }else{
                      router.back();
                    }
                  },
                  onError:()=>{
                    setLoading(false);
                    setShowErrorPopup(true);
                    setErrorPopupMSG({
                      title:"ERROR!",
                      subTitle:"faild to add user"
                    });
                  }
                }
              )
          }

    }
    
    console.log(Companies.data)
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
    {showFirstPopup&&<Popup 
        icon={<FaFlagCheckered />} 
        title="#3" 
        subTitle="Add First User" 
        btnTitle="Next" 
        btnFunc={()=>setShowFirstPopup(false)} 
        onClose={()=>setShowFirstPopup(false)} />}
      {showErrorPopup&&<Popup icon={<Lottie animationData={ErrorIcon}  style={{ width: 350, height: 250 }} loop={false}/>} title={ErrorPopupMSG.title} subTitle={ErrorPopupMSG.subTitle} onClose={()=>setShowErrorPopup(false)}/>}
    <div style={{margin:"30px"}}>
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
                    Employees limit in your plan
                  </p>
                  <strong style={{ fontSize: "16px", color: "#08ab95" }}>
                    {maxEmployees} / {Employees?.data?.length??0}
                  </strong>
                </div>
              </div>
            </header>
        <div style={{display:'flex',flexWrap:"wrap",maxWidth:900,alignItems:"center",gap:20}}>
            <InputComponent label='Fullname' placeholder='Please enter your fullname' value={full_name ?? ''} onTyping={(txt)=>{setFull_Name(txt)}}/>
            <InputComponent label='Email' placeholder='Please enter your email' value={email?? ''} onTyping={(txt)=>{setEmail(txt)}}/>
            <InputComponent label='Phone number' placeholder='Please enter your phone number' value={phone?? ''} onTyping={(txt)=>{setPhone(txt)}}/>
            <InputComponent label='Job title' placeholder='Please enter your job title' value={jobTitle?? ''} onTyping={(txt)=>{setJobTitle(txt)}}/>
            <InputComponent label='Password' placeholder='Please enter your password' value={password?? ''} onTyping={(txt)=>{setPassword(txt)}}/>
            <DropListComponent label='Company' placeholder='Choose your Company' list={CompaniesList??[]}  onSelect={(val)=>{handelSelectCompany(val)}}/>
            {/* <DropListComponent label='Department' placeholder='Choose your Departnment' list={[]}  onSelect={()=>{}}/> */}
            <DropListComponent label='Role' placeholder='Choose your Role' list={RolesList??[]}  onSelect={(val)=>{setSelectedRole(val)}}/>
            <DropListComponent label='Site' placeholder='Choose your Site'  list={sitesList ?? []}  onSelect={(val)=>{setSelectedSite(val)}}/>
        </div>

      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '20px 10px 0px 10px' ,
        }}>
        <div style={{flex:1}}>
          <BottonComponent disabled={isPending} onClick={handelSubmitEmpData} title='Save'/>
        </div>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
      </div>
    </div>
    </div>
  )
}

export default AddUserForm
