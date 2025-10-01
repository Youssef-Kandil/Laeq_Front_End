import React, { useEffect, useRef } from 'react';
import Style from './DropListComponent.module.css';
import { IoIosArrowDown } from "react-icons/io";
import FormGroup from '@mui/material/FormGroup';

interface listType {
  id: number;
  value: string;
  title?: string;
}

interface props {
  label: string;
  list: listType[];
  placeholder?: string;
  defaultOption?: listType;
  value?: listType | null;
  onSelect?: (val: listType) => void;
}

function DropListComponent({
  label,
  list,
  placeholder = "اختر...",
  defaultOption,
  value,
  onSelect,
}: props) {
  const [SelectedValue, setSelectedValue] = React.useState<listType | null>(defaultOption ?? null);
  const [showPicker, setShowPicker] = React.useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ✅ التحديث عند استلام قيمة من الخارج
  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  // ✅ التحديث عند استلام defaultOption
  useEffect(() => {
    if (defaultOption && !value) {
      setSelectedValue(defaultOption);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOption]);

  // ✅ اغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handelSelectValue(value: listType) {
    setSelectedValue(value);
    onSelect?.(value);
    setShowPicker(false);
  }

  return (
    <div 
      onClick={() => {
        if(list.length != 0){
          setShowPicker(!showPicker)
        }
      }} 
      className={Style.input_wrapper} ref={wrapperRef}>
    {/* ================ */}

      <label className={Style.input_label}>{label}</label>
      <div id={Style.piker} className={Style.input_container}>
        <div
          className={Style.selected_value}
          onClick={() => {
            if(list.length != 0){
              setShowPicker(!showPicker)
            }
          }} 
        >
          {SelectedValue?.title ?? placeholder}
        </div>
        <IoIosArrowDown 
          onClick={() => {
            if(list.length != 0){
              setShowPicker(!showPicker)
            }
          }} 
        />

        {showPicker && (
          <div className={Style.options}>
            <div className={Style.title}>
              <p>{list.length != 0?label:"Error No Data In The List"}</p>
            </div>

            <FormGroup className={Style.list}>
              {list.map((el, index) => (
                <span
                  key={index}
                  onClick={() => handelSelectValue(el)}
                  className={Style.label}
                >
                  {el.title ?? el.value}
                </span>
              ))}
            </FormGroup>
          </div>
        )}
      </div>
    </div>
  );
}

export default DropListComponent;
