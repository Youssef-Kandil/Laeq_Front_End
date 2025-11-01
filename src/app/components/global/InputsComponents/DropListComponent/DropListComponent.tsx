import React, { useEffect, useRef, useState } from 'react';
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
  const [selectedValue, setSelectedValue] = useState<listType | null>(defaultOption ?? null);
  const [selectedId, setSelectedId] = useState<number | null>(defaultOption?.id ?? null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ✅ تحديث القيمة من الخارج
  useEffect(() => {
    if (value) {
      if(value.id !== selectedId ){
        setSelectedValue(value);
        setSelectedId(value.id);
      }
    }
  }, [value,selectedId]);

  // ✅ تحديث الـ defaultOption
  useEffect(() => {
    if (defaultOption && !value) {
      setSelectedValue(defaultOption);
      setSelectedId(defaultOption.id);
    }
  }, [defaultOption, value]);

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

  function handleSelectValue(item: listType) {
    if (selectedId !== item.id) {
      setSelectedValue(item);
      setSelectedId(item.id);
      onSelect?.(item);
      setSearchText('');
      setShowPicker(false);
    }
  }

  // ✅ فلترة القائمة
  const filteredList = list.filter(el =>
    (el.title ?? el.value).toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div 
      onClick={() => list.length !== 0 && setShowPicker(!showPicker)} 
      className={Style.input_wrapper} 
      ref={wrapperRef}
    >
      <label className={Style.input_label}>{label}</label>

      <div id={Style.piker} className={Style.input_container}>
        <div className={Style.selected_value}>
          {selectedValue?.title ?? placeholder}
        </div>

        <IoIosArrowDown />

        {showPicker && (
          <div className={Style.options}>
            <div className={Style.title}>
              <p>{list.length !== 0 ? label : "Error: No Data In The List"}</p>
            </div>

            {list.length !== 0 && (
              <input
                type="text"
                className={Style.search_input}
                placeholder="search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <FormGroup className={Style.list}>
              {filteredList.length > 0 ? (
                filteredList.map((el) => (
                  <span
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleSelectValue(el);
                      console.log("el?.id ?? ",el?.id);
                      console.log("value?.id ?? ",value?.id);
                      console.log("selectedId ?? ",selectedId);
                      console.log("value?.id === el?.id ?? ",value?.id === el?.id);
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      backgroundColor: value?.id === el?.id? "#F1F5F9" : "transparent",
                      color: value?.id === el?.id? "#1E293B" : "#333",
                      fontWeight: value?.id === el?.id? 600 : 400,
                      transition: "background 0.2s ease",
                    }}
                  >
                    {el.title ?? el.value}
                  </span>
                ))
              ) : (
                <span className={Style.no_result}>لا توجد نتائج</span>
              )}
            </FormGroup>
          </div>
        )}
      </div>
    </div>
  );
}

export default DropListComponent;
