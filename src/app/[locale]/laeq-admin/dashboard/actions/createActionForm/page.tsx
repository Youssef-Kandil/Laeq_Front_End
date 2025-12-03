"use client";
import React from 'react'

// import {useLocale} from 'next-intl';
// import {usePathname, useRouter } from "next/navigation"; 
// import { SelectChangeEvent } from '@mui/material';
import { useRouter } from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import { useGetCompaniesByUserId } from '@/app/Hooks/useCompany';
import {useEmployees} from '@/app/Hooks/useEmployees';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import DropListComponent from '@/app/components/global/InputsComponents/DropListComponent/DropListComponent';
import { useAddAction } from '@/app/Hooks/useActions';
import { DropListType } from '@/app/Types/DropListType';
import { AccountInfo } from '@/app/Types/AccountsType';
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'


function CreateActionForm() {
    // const current_lang = useLocale();
    const router = useRouter();
    const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const isEmployee = info?.role === "employee";
    const AdminID =  isEmployee?info.userDetails.admin_id:info?.userDetails.id
    // const limits = info?.userDetails?.admin_account_limits;
    const Employees = useEmployees(AdminID ?? 0);
    const Companies = useGetCompaniesByUserId(info?.userDetails.id ?? 0);
    const [showPopup,setShowPopup] = React.useState<boolean>(false);
    const [showErrorPopup,setShowErrorPopup] = React.useState<boolean>(false);
    const [ErrorPopupMSG,setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});
    const [loading,setLoading] = React.useState<boolean>(false);
    // ==== Values
    const [actionTitle,setActionTitle] = React.useState<string>("");
    const [actionLevel,setActionLevel] = React.useState<"medium"|"low"|"high">("medium");
    const [userAssignedTo,setUserAssignedTo] = React.useState<number>(-1);
    const [company,setCompany] = React.useState<number>(-1);
    const [site,setSite] = React.useState<number>(-1);

    // ==== Lists
    const EmployeesList = Employees.data?.map((item:{id:number,full_name:string,users:{email:string,id:number}}) => ({
      id: item.users.id,
      value: String(item.users.id),
      title: item.full_name,
    }));

    const CompaniesList = Companies.data?.map((item:{id:number,company_name:string}) => ({
      id: item.id,
      value: String(item.id),
      title: item.company_name,
    }));
    
    function getSitesByCompanyId(companyId:number) {
      const company = Companies.data.find((c :{id:number}) => c.id === companyId);
      const SitesList = company.sites?.map((item:{id:number,site_name:string}) => ({
        id: item.id,
        value: item.id,
        title: item.site_name,
      }));
      
      
      return company ? SitesList : [];
    }

    const [sitesList,setSitesList] = React.useState<DropListType[]|null>(null);

    function handelSelectCompany(company:DropListType){
      setCompany(company.id)    
      setSitesList(getSitesByCompanyId(company.id))
    }

    const {mutate:addNewAction} = useAddAction();
    function handeleSubmet(){
      setLoading(true);
      if(actionTitle.trim().length === 0){
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({title:"Wrong!",subTitle:"Action must have a title"});
        return;        
      }
      if (userAssignedTo == -1) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({title:"Wrong!",subTitle:"Must Select User"});
        return;       
      }
      if (company == -1) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({title:"Wrong!",subTitle:"Must Select Company"});
        return;        
      }
      if (site == -1) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({title:"Wrong!",subTitle:"Must Select Site"}); 
        return; 
      }
      if (!AdminID) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({title:"Wrong!",subTitle:"re-login and try agin later!"}); 
        return; 
      }
      if (!info?.id) {
        setLoading(false);
        setShowErrorPopup(true);
        setErrorPopupMSG({title:"Wrong!",subTitle:"re-login and try agin later!"}); 
        return; 
      }
      console.log("DATA ::: ",        {
        action_title:actionTitle,
        assigned_to:userAssignedTo,
        created_by:info?.id??-1,
        admin_id:AdminID??-1,
        status:"Pending",
        company_id:company,
        site_id:site

      })
      addNewAction(
        {
          action_title:actionTitle,
          assigned_to:userAssignedTo,
          created_by:info?.id??-1,
          admin_id:AdminID??-1,
          status:"Pending",
          importance_level:actionLevel,
          company_id:company,
          site_id:site
        },
        {
          onSuccess:()=>{
            router.back();
          },
          onError:()=>{
            setLoading(false);
            setShowErrorPopup(true);
            setErrorPopupMSG({
                title: "Failed to add template",
                subTitle: "An error occurred while saving. Please try again."
            });
          }
        }
      );
    }

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

      {showPopup&&<Popup title={"Congratulations!"} subTitle="Your Action has been added successfully." btnTitle="Go To Actions List" btnFunc={()=>{setShowPopup(false)}} onClose={()=>{}}/>}
      {showErrorPopup&&<Popup 
              icon={
                <Lottie
                animationData={WorngIcon}
                loop={false}
                style={{ width: 150, height: 150 }}
              />
              } 
              title={ErrorPopupMSG.title} 
              subTitle={ErrorPopupMSG.subTitle} 
              btnTitle="Ok" 
              btnFunc={()=>{setShowErrorPopup(false)}} 
              onClose={()=>{setShowErrorPopup(false)}}/>}
      <div style={{marginLeft:"30px",marginRight:"30px",marginTop:"30px"}}>
          <div style={{display:'flex',flexWrap:"wrap",maxWidth:900,alignItems:"center",gap:20}}>
              <InputComponent label='Action name' placeholder='Please enter your action name' value={actionTitle} onTyping={(txt)=>{setActionTitle(txt)}}/>
              <DropListComponent label='Level' placeholder='Choose action level' list={[{id:0,value:"Medium",title:"Medium"},{id:1,value:"Low",title:"Low"},{id:2,value:"High",title:"High"}]}  onSelect={(el)=>{setActionLevel(el?.value as "medium"|"low"|"high")}}/>
              <DropListComponent label='User' placeholder='Choose your user' list={EmployeesList??[]}  onSelect={(el)=>{setUserAssignedTo(el.id)}}/>
              <DropListComponent label='Company' placeholder='Choose your Company' list={CompaniesList??[]}  onSelect={(el)=>{handelSelectCompany(el)}}/>
              <DropListComponent label='Site' placeholder='Choose your Site' list={sitesList??[]}  onSelect={(el)=>{setSite(el.id)}}/>
          </div>
        {/* <InputComponent label='Description' placeholder='Please enter your description' isTextArea={true}  value='' onTyping={()=>{}}/> */}

        <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              margin: '0px 10px' ,
          }}>
          <div style={{flex:1}}>
            <BottonComponent title='Send Action' onClick={handeleSubmet}/>
          </div>
          <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
        </div>
      </div>
    </div>
  )
}

export default CreateActionForm
