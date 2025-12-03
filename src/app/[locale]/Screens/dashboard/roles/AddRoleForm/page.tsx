"use client";
import React from 'react';

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import CheckBoxComponent from '@/app/components/global/InputsComponents/CheckBoxComponent/CheckBoxComponent';
import { useRouter ,useSearchParams } from "next/navigation"; 
import { useLocale } from "next-intl";
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import app_identity from '@/app/config/identity';
import { usePermissions } from '@/app/Hooks/usePermissions';
import { useCreateRole } from '@/app/Hooks/useRole';
import { getAdminAccountInfo } from '../../../../../utils/getAccountInfo';
import { RolePayload } from '@/app/Types/RoleType';
import { AccountInfo } from '@/app/Types/AccountsType';
import Popup from "@/app/components/global/Popup/Popup";
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'
import { FaFlagCheckered } from "react-icons/fa";




function AddRoleForm() {
    const router = useRouter();
    const params = useSearchParams();
    const local = useLocale();
    const AdminInfo = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const RoleMutation =  useCreateRole();
    const {data} = usePermissions();
    console.log(params.get("count"));
    const isFirstTime = localStorage.getItem("first_time");
    const [showFirstPopup, setShowFirstPopup] = React.useState<boolean>(false);
    
    React.useEffect(() => {
      if (!isFirstTime && params && Number(params.get("count")) === 0) {
        setShowFirstPopup(true);
      } else {
        setShowFirstPopup(false);
      }
    }, [params, isFirstTime]);
    const [isSubmitLoading,setIsSubmiLoading] = React.useState<boolean>(false);
    const [showErrorPopup, setShowErrorPopup] =  React.useState<boolean>(false);
    const [ErrorPopupMSG, setErrorPopupMSG] =  React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});
    console.log(params.get("count"));
    const [roleName,setRoleName] = React.useState<string>("");
    const [roleDescription,setRoleDescription] = React.useState<string>("");
    const [permissionsIdList,setPermissionsIdList] = React.useState<number[]>([]);
    console.warn("permissionsIdList : ",permissionsIdList)

      const handleAddRole = () => {
        setIsSubmiLoading(true);
        if (!AdminInfo) {
            // Handle the case where AdminInfo is null, e.g., show an error or return early
            setIsSubmiLoading(false);
            setShowErrorPopup(true);
            setErrorPopupMSG({
              title:"Failed",
              subTitle:"Something went wrong"
            })
            return;
        }
        if (
          roleName.length == 0
          || roleDescription.length == 0
          || permissionsIdList.length == 0
         ) {
          setIsSubmiLoading(false);
            setShowErrorPopup(true);
            setErrorPopupMSG({
              title:"Failed",
              subTitle:"Complete all fields"
            })
            return;           
        }
        const payload:RolePayload = {
          admin_id: AdminInfo.userDetails.id,
          role_name:roleName,
          description:roleDescription,
          permissionsIds: permissionsIdList
        };

        RoleMutation.mutate(payload, 
          { 
            onSuccess: () => {
              if (!isFirstTime) {
                router.replace(`/${local}/Screens/dashboard/users/AddUserForm`);
              }else{
                router.back();
              }
            },
            onError:()=>{
              setIsSubmiLoading(false);
              setShowErrorPopup(true);
              setErrorPopupMSG({
                title:"Error",
                subTitle:"Failed to add Role",
              })
            }
         }
        );

  };

  return (
    <div>
      {showFirstPopup&&<Popup 
        icon={<FaFlagCheckered />} 
        title="#2" 
        subTitle="Add New Role" 
        btnTitle="Next" 
        btnFunc={()=>setShowFirstPopup(false)} 
        onClose={()=>setShowFirstPopup(false)} />}

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

      {showErrorPopup&&<Popup 
        icon={<Lottie animationData={WorngIcon}  loop={false} style={{ width: 350, height: 250 }}/>} 
        title={ErrorPopupMSG.title}
        subTitle={ErrorPopupMSG.subTitle}
        onClose={()=>{
          setShowErrorPopup(false);
        }} />}
      <div style={{
          margin:'12px 10px',
          padding:'0 22px'
      }}>

          <InputComponent label='Role Name*' placeholder='Please enter your role name' onTyping={(txt)=>{setRoleName(txt)}} value={roleName}/>

          <InputComponent 
              label='Description' 
              placeholder='Please enter your description' 
              onTyping={(txt)=>{setRoleDescription(txt)}}
              value={roleDescription}
              isTextArea
              />

          <div style={{margin:'20px 0'}}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <p style={{fontSize:16,fontWeight:500}}>Role Permissions</p>
                  <p style={{color:app_identity.secondary_color,textDecorationLine:'underline',cursor:'pointer'}}>more</p>
              </div>
              {data?.map((permission: { id: number; permission_name: string }, i: number) => {
                return <CheckBoxComponent
                        key={i}
                        label={permission.permission_name}
                        checked={permissionsIdList.includes(permission.id)}
                        onCheck={(checked) => {
                          setPermissionsIdList(prev => {
                            if (checked) {
                              return [...prev, permission.id];
                            } else {
                              return prev.filter(id => id !== permission.id);
                            }
                          });
                        }}
                      />
                
              })}
        </div>

        <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              margin: '0px 10px' ,
          }}>
          <div style={{flex:1}}>
            <BottonComponent disabled={RoleMutation.isPending} onClick={handleAddRole} title='Save'/>
          </div>
          <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
        </div>
        
      </div>
    </div>
  )
}

export default AddRoleForm

