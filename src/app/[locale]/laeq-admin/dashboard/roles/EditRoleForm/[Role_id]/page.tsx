/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
import CheckBoxComponent from '@/app/components/global/InputsComponents/CheckBoxComponent/CheckBoxComponent';
import { useRouter ,useParams} from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import app_identity from '@/app/config/identity';
import { usePermissions } from '@/app/Hooks/usePermissions';
import { getAdminAccountInfo } from '../../../../../../utils/getAccountInfo';
import { RolePayload } from '@/app/Types/RoleType';
import { AccountInfo } from '@/app/Types/AccountsType';
import Popup from "@/app/components/global/Popup/Popup";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { useGetRoleDataByID , useEditRole } from '@/app/Hooks/useRole';

function EditRoleForm() {
  const router = useRouter();
  const { Role_id } = useParams();
  const AdminInfo = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
  const { data } = usePermissions();

  const [showErrorPopup, setShowErrorPopup] = React.useState<boolean>(false);
  const [ErrorPopupMSG, setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});

  const [roleName,setRoleName] = React.useState<string>("");
  const [roleDescription,setRoleDescription] = React.useState<string>("");
  const [permissionsIdList,setPermissionsIdList] = React.useState<number[]>([]);

  const { mutate, isPending } = useEditRole();
  const { data:roleData } = useGetRoleDataByID(Number(Role_id) ?? -1);

  // ✅ اول لما الداتا تيجي حطها في ال state
  React.useEffect(() => {
    if (roleData) {
      setRoleName(roleData.role_name ?? "");
      setRoleDescription(roleData.description ?? "");
      setPermissionsIdList(roleData.role_permissions?.map((p:any)=>p.permission_id)??[]);
    }
  }, [roleData]);


  const handleEditRole = () => {
    if (!AdminInfo) {
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Failed",
        subTitle:"Something went wrong"
      })
      return;
    }
    if (
      roleName.length == 0 ||
      roleDescription.length == 0 ||
      permissionsIdList.length == 0
    ) {
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Failed",
        subTitle:"Complete all fields"
      })
      return;           
    }

    const payload:RolePayload = {
      id:Number(Role_id)??-1,  
      admin_id: AdminInfo.userDetails.id,
      role_name:roleName,
      description:roleDescription,
      permissionsIds: permissionsIdList
    };

    mutate(payload, { 
      onSuccess: () => router.back(),
      onError:()=>{
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"Error",
          subTitle:"Failed to Edit Role",
        })
      }
    });
  };

  return (
    <div>
      {showErrorPopup && (
        <Popup 
          icon={<HiMiniArchiveBoxXMark color="rgba(168, 17, 17, 0.5)" />} 
          title={ErrorPopupMSG.title}
          subTitle={ErrorPopupMSG.subTitle}
          btnTitle="OK" 
          btnFunc={()=> setShowErrorPopup(false)} 
          onClose={()=> setShowErrorPopup(false)} 
        />
      )}

      <div style={{margin:'12px 10px', padding:'0 22px'}}>
        <InputComponent 
          label='Role Name*' 
          placeholder='Please enter your role name' 
          onTyping={setRoleName} 
          value={roleName}
        />

        <InputComponent 
          label='Description' 
          placeholder='Please enter your description' 
          onTyping={setRoleDescription}
          value={roleDescription}
          isTextArea
        />

        <div style={{margin:'20px 0'}}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p style={{fontSize:16,fontWeight:500}}>Role Permissions</p>
            <p style={{color:app_identity.secondary_color,textDecorationLine:'underline',cursor:'pointer'}}>more</p>
          </div>
          {data?.map((permission: { id: number; permission_name: string }, i: number) => {
            const isChecked = permissionsIdList.includes(permission.id);
            console.log("permissionsIdList Check Box ::  ",permissionsIdList)
            console.log("isChecked Check Box ::  ",isChecked)
            console.log("permission checked Check Box ::  ",permission)
                return (
                    <CheckBoxComponent
                    key={i}
                    label={permission.permission_name}
                    checked={isChecked}   // ✅ هنا بنبعت الحالة
                    onCheck={(isChecked) => {
                        setPermissionsIdList(prev => {
                        if (isChecked) {
                            return [...prev, permission.id];
                        } else {
                            return prev.filter(id => id !== permission.id);
                        }
                        });
                    }}
                    />
                );
            })}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          margin: '0px 10px' ,
        }}>
          <div style={{flex:1}}>
            <BottonComponent disabled={isPending} onClick={handleEditRole} title='Edit'/>
          </div>
          <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
        </div>
      </div>
    </div>
  )
}

export default EditRoleForm;
