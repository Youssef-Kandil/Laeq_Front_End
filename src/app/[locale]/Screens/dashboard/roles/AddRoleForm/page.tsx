"use client";
import React from 'react';

import InputComponent from '@/app/components/global/InputComponent/InputComponent';
import CheckBoxComponent from '@/app/components/global/CheckBoxComponent/CheckBoxComponent';
import { useRouter } from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';
import app_identity from '@/app/config/identity';
import { usePermissions } from '@/app/Hooks/usePermissions';
import { useCreateRole } from '@/app/Hooks/useRole';
import { getAdminAccountInfo } from '../../../../../utils/getAccountInfo';
import { RolePayload } from '@/app/Types/RoleType';


function AddRoleForm() {
    const router = useRouter();
    const AdminInfo = getAdminAccountInfo()
    const RoleMutation =  useCreateRole();
    const {data,isLoading,isError,error,isSuccess} = usePermissions();

    const [roleName,setRoleName] = React.useState<string>("");
    const [roleDescription,setRoleDescription] = React.useState<string>("");
    const [permissionsIdList,setPermissionsIdList] = React.useState<number[]>([]);
    console.log(data)
    console.warn("permissionsIdList : ",permissionsIdList)

      const handleAddRole = () => {
        if (!AdminInfo) {
            // Handle the case where AdminInfo is null, e.g., show an error or return early
            console.error("AdminInfo is null. Cannot add role.");
            return;
        }
        if (
          roleName.length == 0
          || roleDescription.length == 0
          || permissionsIdList.length == 0
         ) {
            console.error("Must Add Role Name, Description And Permissions");
            return;           
        }
        const payload:RolePayload = {
          admin_id: AdminInfo.userDetails.id,
          role_name:roleName,
          description:roleDescription,
          permissionsIds: permissionsIdList
        };

        RoleMutation.mutate(payload, { onSuccess: () => router.back() });

  };

  return (
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
          <BottonComponent onClick={handleAddRole} title='Save'/>
        </div>
        <p onClick={()=>router.back()} style={{flex:5,cursor:"pointer"}}>Cancel</p>
      </div>
      
    </div>
  )
}

export default AddRoleForm

