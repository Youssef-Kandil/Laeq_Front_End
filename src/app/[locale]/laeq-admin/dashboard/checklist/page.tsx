// ======== MAIN PARENT CHECK LISTS BOXES SCREEN
"use client";
import React from 'react'
import { useCheckList ,useDeleteCheckList } from '@/app/Hooks/useCheckList';
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';
import Styles from './checklists.module.css'
import Card from '@/app/components/global/TemplateCard/Card';
import {useTranslations} from 'next-intl';
import { IoIosSearch } from "react-icons/io";
import { getAdminAccountInfo } from '@/app/utils/getAccountInfo';
import { AccountInfo } from '@/app/Types/AccountsType';
import SkeletonLoader from '@/app/components/global/SkeletonLoader/SkeletonLoaders';
import Popup from '@/app/components/global/Popup/Popup';
import Lottie from "lottie-react";
import WorngIcon  from '@/app/Lottie/wrong.json'
import LoadingIcon  from '@/app/Lottie/Loading animation blue.json'

function CheckLists() {
    const current_lang = useLocale();
    const router = useRouter();
    const t = useTranslations('table_component');
    React.useEffect(()=>{
        localStorage.setItem('clickedAsideTitle',"checklist");
    },[])
    const info = getAdminAccountInfo("AccountInfo") as AccountInfo | null;
    const targetId  = info?.userDetails?.id;
    console.log("targetId >> " ,targetId);


    const [showErrorPopup, setShowErrorPopup] = React.useState<boolean>(false);
    const [ErrorPopupMSG, setErrorPopupMSG] = React.useState<{title:string,subTitle:string}>({title:"",subTitle:""});
    const [loading,setLoading] = React.useState<boolean>(false);

      
      const {mutate:deleteCheckLists } = useDeleteCheckList();
      const { data, isLoading:loadingCheckLists, isError } = useCheckList(Number(targetId)??-1);


        if (loadingCheckLists) {
          return <SkeletonLoader/>;
        }

        if (isError) {
          return <div>حدث خطأ</div>;
        }

        if (!data) {
          return <div>لا توجد بيانات</div>;
        }

        const handelDeleteChecklist =(id:number)=>{
          setLoading(true);
          deleteCheckLists({id},{
            onSuccess:()=>{
              setLoading(false);
            },
            onError:()=>{
              setLoading(false);
              setShowErrorPopup(true);
              setErrorPopupMSG({title:"Wrong!",subTitle:"try again"});
            },
          })
        }
        const idx = (data || [])?.findIndex((item: { owner: string | undefined; }) => item?.owner === info?.email);
        console.log("data :: ",data[idx])

      const Cards = data?.map((card:{id:number,checklist_title:string,admin_id:number},indx:number)=>{
        return <Card key={indx} isLaeq={true} disabledMenu={data[idx]?.id == card?.id} onDelete={()=>handelDeleteChecklist(card.id)} onEdit={()=>router.push(`/${current_lang}/laeq-admin/dashboard/checklist/EditCheckList/${card.id}`)} title={card.checklist_title} imgSrc={""} cardInfo={card}/>
      })



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
              btnTitle="OK" 
              btnFunc={()=>{
                setShowErrorPopup(false);
              }} 
              onClose={()=>{
                setShowErrorPopup(false);
              }} />}

    <div className={Styles.parent}>
        <nav>
            <div className={Styles.pikers}>
                <div className={Styles.input_container}>
                    <IoIosSearch style={{fontSize:22}}/>
                    <input type="text" placeholder={t("search")} id="" />
                </div>
            </div>
          {/* === START BTN */}  
          {/* {(!isEmployee&& maxChecklist != 0&&maxChecklist)&& <button onClick={()=>router.push(`/${current_lang}/Screens/dashboard/checklist/AddNewTemplateForm`)} className={Styles.button} >Add New Checklist</button>} */}
          <div className={Styles.btns}>
            {<button onClick={()=>router.push(`/${current_lang}/laeq-admin/dashboard/checklist/AddNewTemplateForm/${data[idx].id}`)} className={Styles.button2} >Add New Template</button>}
            {<button onClick={()=>router.push(`/${current_lang}/laeq-admin/dashboard/checklist/AddNewChecklist`)} className={Styles.button} >Add New Category</button>}
          </div>

          
             
        </nav>

      <section>
        <h3 className={Styles.title}>Checklists</h3>
        <div className={Styles.cardsList}>
          {Cards}
        </div>
      </section>
      
    </div>
    </div>
  )
}

export default CheckLists
