"use client" 
import React from 'react'
import Styles from './contact_us.module.css'
import ContactUs from '../../forms/contactUs/page'
function Contact_us() {
      React.useEffect(()=>{
        localStorage.setItem('clickedTitle', "contact_us");
      },[])
  return (
    <div className={Styles.parent}>

      <section id={Styles.formSection}>
        
        <div className={Styles.Container}>
          <div className={Styles.form}> 
              <ContactUs />
          </div>
          <div className={Styles.map}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7243.430219546066!2d46.656589!3d24.805207!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee38d5474d8a9%3A0x98ccf678b0fb1d23!2sLaeq%20Food%20Safety!5e0!3m2!1sen!2ssa!4v1758609454983!5m2!1sen!2ssa" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
        <div className={Styles.backGround}></div>
      </section>
    </div>
  )
}

export default Contact_us
