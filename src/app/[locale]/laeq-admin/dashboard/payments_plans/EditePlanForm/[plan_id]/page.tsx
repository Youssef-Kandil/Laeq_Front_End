/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';

import InputComponent from '@/app/components/global/InputsComponents/InputComponent/InputComponent';
// import CheckBoxComponent from '@/app/components/global/InputsComponents/CheckBoxComponent/CheckBoxComponent';
import { useRouter ,useParams} from "next/navigation"; 
import BottonComponent from '@/app/components/global/ButtonComponent/BottonComponent';


import Popup from "@/app/components/global/Popup/Popup";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { useGetPaymentPlanData,useUpdatePlane } from '@/app/Hooks/usePaymentPlans';

function EditPlanForm() {
  const router = useRouter();
  const { plan_id } = useParams();
  

  const [showErrorPopup, setShowErrorPopup] = React.useState<boolean>(false);
  const [ErrorPopupMSG, setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});

  const [planName,setPlanName] = React.useState<string>("");
  const [planPrice,setPlanPrice] = React.useState<string>("");

  // const [featuresIdList,setFeaturesIdList] = React.useState<number[]>([]);

  const { mutate, isPending } = useUpdatePlane();
  const { data:planData } = useGetPaymentPlanData(Number(plan_id) ?? -1);

  // ✅ اول لما الداتا تيجي حطها في ال state
  React.useEffect(() => {
    if (planData) {
        setPlanName(planData.plaData.title ?? "");
        setPlanPrice(planData.plaData.price ?? "");
        // setFeaturesIdList(planData.plan_features?.map((p:any)=>p.feature_id)??[]);
    }
  }, [planData]);


  const handleEditRole = () => {
   
    if (
        planData.length == 0 ||
        planData.length == 0 
        // featuresIdList.length == 0
    ) {
      setShowErrorPopup(true);
      setErrorPopupMSG({
        title:"Failed",
        subTitle:"Complete all fields"
      })
      return;           
    }

    const payload:any = {
      id:Number(plan_id)??-1,  
      title:planName,
      price:planPrice,
    };

    mutate(payload, { 
      onSuccess: () => router.back(),
      onError:()=>{
        setShowErrorPopup(true);
        setErrorPopupMSG({
          title:"Error",
          subTitle:"Failed to Edit Plan",
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
          label='Plan Name*' 
          placeholder='Please enter your Plan name' 
          onTyping={setPlanName} 
          value={planName}
        />
        <InputComponent 
          label='Price*' 
          placeholder='Please enter Price' 
          onTyping={setPlanPrice} 
          value={planPrice}
        />



        {/* <div style={{margin:'20px 0'}}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p style={{fontSize:16,fontWeight:500}}>Role Permissions</p>
            <p style={{color:app_identity.secondary_color,textDecorationLine:'underline',cursor:'pointer'}}>more</p>
          </div>
          {planData?.features?.map((feature: { id: number; feature_name: string }, i: number) => {
            const isChecked = featuresIdList.includes(feature.id);
            console.log("permissionsIdList Check Box ::  ",featuresIdList)
            console.log("isChecked Check Box ::  ",isChecked)
            console.log("permission checked Check Box ::  ",feature)
                return (
                    <CheckBoxComponent
                    key={i}
                    label={feature.feature_name}
                    checked={isChecked}   // ✅ هنا بنبعت الحالة
                    onCheck={(isChecked) => {
                        setFeaturesIdList(prev => {
                        if (isChecked) {
                            return [...prev, feature.id];
                        } else {
                            return prev.filter(id => id !== feature.id);
                        }
                        });
                    }}
                    />
                );
            })}
        </div> */}

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

export default EditPlanForm;
