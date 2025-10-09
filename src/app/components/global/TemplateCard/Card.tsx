"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Styles from './card.module.css';
import { IoEllipsisVertical } from "react-icons/io5";
import { IoMdListBox } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface Props {
  title: string;
  imgSrc?: string;
  cardInfo: { id: number; checklist_title: string };
  onDelete: (id: number) => void; // 🗑️ فانكشن الحذف
  onEdit: (id: number) => void; 
  disabledMenu?:boolean;  // ❤️ فانكشن التعديل
  
}

function Card({ title, imgSrc, cardInfo, disabledMenu=false,onDelete, onEdit }: Props) {
  const router = useRouter();
  const current_lang = useLocale();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // === navigate to quizs ===
  const handelGetQuizs = () => {
    const TemplateID = cardInfo.id;
    router.push(`/${current_lang}/Screens/dashboard/checklist/Quizes/${cardInfo.checklist_title}-${TemplateID}`);
  };

  // === close menu when clicking outside ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={Styles.card} onClick={handelGetQuizs}>
      {imgSrc ? (
        <Image src={imgSrc} alt='' width={280} height={254} />
      ) : (
        <div className={Styles.notImg}><IoMdListBox /></div>
      )}

      <div  className={Styles.cardFooter}>
        <h3>{title || "Food Safety & Hygiene"}</h3>
        <div className={Styles.menuContainer} ref={menuRef}>
          <IoEllipsisVertical 
            className={Styles.icon}
            
            onClick={(e) => {
              if (!disabledMenu) {                
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }
            }}
          />
          {showMenu && (
            <div className={Styles.dropdownMenu}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cardInfo.id);
                  setShowMenu(false);
                }}
              >
                Edit <MdModeEdit color='rgb(64, 118, 243)' className={Styles.menuIcon} /> 
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cardInfo.id);
                  setShowMenu(false);
                }}
              >
               Delete <RiDeleteBin6Line color='rgb(243, 64, 64)' className={Styles.menuIcon} /> 
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
