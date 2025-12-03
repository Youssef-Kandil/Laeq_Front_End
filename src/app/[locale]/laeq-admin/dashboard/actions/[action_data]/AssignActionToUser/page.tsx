"use client";
import React ,{useState} from 'react'
import {ClientOnlyTable} from '@/app/components/global/Table/Table';
// import { HiOutlineDotsVertical } from "react-icons/hi";
import { useParams ,useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import { useEmployees } from '@/app/Hooks/useEmployees';
import { useAssignAction } from '@/app/Hooks/useActions';
import encryption from '@/app/utils/encryption';
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'

interface Employee {
  id:number;
  full_name: string;
  user_id?:number;
  company_id?:number;
  site_id?:number;
  users: { email: string };
  sites: { site_name: string };
  companies: { company_name: string };
  roles: { role_name: string };
}

interface AssignActionPayload {
  action_id: number;
  user_id: number;
}


function ChooseUserTableScreen() {
      const router = useRouter();
      const current_lang = useLocale();

    // Start Sceleton Loading..
    //  Get template ID  From Params
      const params = useParams(); 
      const   {action_data}= params;
      const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
      const [ErrorPopupMSG, setErrorPopupMSG] = useState<{title:string,subTitle:string}>({title:"",subTitle:""});
      const [loading,setLoading] = React.useState<boolean>(false);

      // let action_id: string | undefined = undefined;

      let decryptedActionId: string | undefined = undefined;
      if (typeof action_data === "string") {
        decryptedActionId = encryption.decryption(action_data, "encryptionKey");
      } else if (Array.isArray(action_data) && action_data.length > 0) {
        decryptedActionId = encryption.decryption(action_data[0], "encryptionKey");
      }

      const info = getAdminAccountInfo("AccountInfo");
      const isEmployee = info?.role === "employee";    
      const targetId  =
              isEmployee
                ? info?.userDetails?.admin_id
                : info?.userDetails?.id;
    
      const local_var = "chooseUser.tb_headers";
      //=== Add Action To The Table Rows

      React.useEffect(()=>{
        localStorage.setItem('clickedAsideTitle',"users");
    },[])

    const [selectedUserIds ,setSelectedUserIds]  = React.useState<AssignActionPayload>();


      const {mutate:SendAction} = useAssignAction();

      const { data, isLoading, error } = useEmployees(targetId ?? 0);
      if (isLoading) return <SkeletonLoader variant="table" tableColumns={4} tableRows={5} />;
      if (error) return <p>حصل خطأ!</p>;



    //=== Add Action To The Table Rows

      const modifiedData = data.map(({ id,full_name,companies, users, sites, roles }: Employee) => ({
          id,
          full_name,
          email: users.email,
          site: sites.site_name,
          company: companies.company_name,
          role: roles.role_name,
      }));


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
                  onClose={()=>{
                    setShowErrorPopup(false);
                  }} />}
        <ClientOnlyTable 
            titles={[`${local_var}.id`,`${local_var}.employee`,`${local_var}.email`,`${local_var}.site`,`${local_var}.company`,`${local_var}.role`]}
            data={modifiedData}
            rowsFlex={[0.5,1,1,1,1,1]}
            navButtonTitle='chooseUser'
            navButtonAction={()=>{
              setLoading(true);
              if(selectedUserIds?.user_id){
                SendAction({
                  action_id:selectedUserIds?.action_id??-1,
                  user_id:selectedUserIds?.user_id??-1
                },{
                    onSuccess:()=>{
                        router.replace(`/${current_lang}/laeq-admin/dashboard/actions`);
                    },
                    onError:(error)=>{
                      setLoading(false);
                      setShowErrorPopup(true);
                      setErrorPopupMSG({title:"Wrong!",subTitle:"try again"});
                      console.error("SEND Action ERROR : ",error);
                    }
                })
              }else{
                setLoading(false);
                setShowErrorPopup(true);
                setErrorPopupMSG({title:"Wrong",subTitle:"Must Select One User"});
              }
            }}


            
            useRadioRow
            onRadioChange={(id)=>{
              if(id){
                const selected = data.find((emp:Employee)=> emp.id === id);
                if(selected){
                  setSelectedUserIds({
                    action_id:Number(decryptedActionId),
                    user_id:selected.user_id??-1,
                  });
                }
              }else{

              }
            }}
            
        />
    </div>
  )
}

export default ChooseUserTableScreen