"use client";
import React from "react";
import Styles from './invoice.module.css'
import { useParams,useRouter } from "next/navigation";
import { useGetInvoceDetails } from "@/app/Hooks/useSubscripe"; 
import BottonComponent from "@/app/components/global/ButtonComponent/BottonComponent";
import Image from "next/image";
import app_identity from "@/app/config/identity";
import SkeletonLoader from "@/app/components/global/SkeletonLoader/SkeletonLoaders";



function Invoice_Details() {
  const router = useRouter();
  // const params = useParams();
  const params = useParams() as { subscription_id?: string };

  const { data, isLoading, error } = useGetInvoceDetails(Number(params.subscription_id));
  
  if (isLoading) return <SkeletonLoader/>;
  if (error) router.back();
  if (!data || data.length == 0) return router.back();

  // === Looping On Data ===


  return(
      <div >
        <nav className={Styles.nav}>
          <div className={Styles.nav_details}>

              <div style={{display:'flex',alignItems:"center"}}>
                {/* <Image src={"/images/شعار لائق -06.jpeg"} alt='logo' width={120} height={120}/> */}
                <Image src={"/images/logo365.jpeg"} alt='logo' width={40} height={120}/>
                <strong style={{fontSize:'1.4rem',marginLeft:6}}>
                    <p style={{color:app_identity.primary_color}}>LAEQ</p>
                    <p style={{lineHeight:0.5,color:app_identity.secondary_color}}>365</p>
                </strong>
                </div>
          </div>
          

        <div className={Styles.printBtn}>
          <BottonComponent
            title="Print"
            onClick={()=>window.print()}
          />
        </div>
      </nav>
        <nav className={Styles.navRow}>
          
          <div className={Styles.nav_details}>
            <div>
              <p>Transition ID</p>
              <span>{data?.transaction_id}</span>
            </div>
          </div>

          <div className={Styles.nav_details}>
            <div>
              <p>Email</p>
              <span>{data?.admin_users?.users?.email}</span>
            </div>
          </div>


          <div className={Styles.nav_details}>
            <p>Printed Date</p>
            <span>{new Date(Date.now()).toLocaleDateString("en-GB", {
              day: "numeric",   // اليوم رقم
              month: "short",   // الشهر نص قصير (Jan, Feb, ...)
              year: "numeric",  // السنة رقم
              hour: "2-digit",  // الساعة برقمين
              minute: "2-digit",// الدقايق برقمين
              hour12: true     // نظام 24 ساعة
            })}</span>
          </div>
      </nav>
      {/* ================== */}
      <nav className={Styles.navRow2}>
          {/* <div className={Styles.nav_details}>

              <div style={{display:'flex',alignItems:"center"}}>
                <strong style={{fontSize:'1.4rem',marginLeft:6}}>
                    <p>Plan Details : </p>
                </strong>
                </div>
          </div> */}
          
          <div className={Styles.nav_details}>
            <div>
              <p>Plan Name</p>
              <span>{data?.plans?.title}</span>
            </div>
          </div>
          <div className={Styles.nav_details}>
            <div>
              <p>Plan Duration</p>
              <span>{data?.plans?.is_yearly == 0 ?"Monthly":"Yearly"}</span>
            </div>
          </div>
          <div className={Styles.nav_details}>
            <p>Amount</p>
            <span>{data.amount}<Image src={"/price.svg"} alt='' width={30} height={30}/></span>
          </div>
          <div className={Styles.nav_details}>
            <p>Subscriped at</p>
            <span>{new Date(data.subscripe_at).toLocaleDateString("en-GB", {
              day: "numeric",   // اليوم رقم
              month: "short",   // الشهر نص قصير (Jan, Feb, ...)
              year: "numeric",  // السنة رقم
              hour: "2-digit",  // الساعة برقمين
              minute: "2-digit",// الدقايق برقمين
              hour12: true     // نظام 24 ساعة
            })}</span>
          </div>
      </nav>


      </div>
  ) 
}

export default Invoice_Details;
