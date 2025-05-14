import React from 'react'
import Styles from './contact_us.module.css'
import ContactUs from '../../forms/contactUs/page'
function Contact_us() {
  return (
    <div className={Styles.parent}>

      <section id={Styles.formSection}>
        
        <div className={Styles.Container}>
          <div className={Styles.form}> 
              <ContactUs />
          </div>
          <div className={Styles.map}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14944301.801319756!2d55.732142045848704!3d23.871485633342704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15e7b33fe7952a41%3A0x5960504bc21ab69b!2z2KfZhNiz2LnZiNiv2YrYqQ!5e0!3m2!1sar!2seg!4v1744818034862!5m2!1sar!2seg" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
        <div className={Styles.backGround}></div>
      </section>
    </div>
  )
}

export default Contact_us
