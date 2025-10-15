import React, { useEffect, useRef, useState } from 'react';
import Style from './MultiDropListComponent.module.css';
import { IoIosArrowDown } from "react-icons/io";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface listType {
  id: number;
  value: string;
  title?: string;
}

interface props {
  label: string;
  list: listType[];
  placeholder?: string;
  defaultOptions?: listType[];
  values?: listType[];
  onSelect?: (val: string[]) => void; // ✅ ترجع array of strings
}

function MultiDropListComponent({
  label,
  list,
  placeholder = "اختر...",
  defaultOptions = [],
  values,
  onSelect,
}: props) {
  const [selectedValues, setSelectedValues] = useState<listType[]>(defaultOptions);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ✅ تحديث القيم القادمة من الخارج
  useEffect(() => {
    if (values) {
      setSelectedValues(values);
    }
  }, [values]);

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

  // ✅ دالة تغيير التحديد
  function handleToggleValue(item: listType) {
    const exists = selectedValues.some(v => v.id === item.id);
    let newValues: listType[];
    if (exists) {
      newValues = selectedValues.filter(v => v.id !== item.id);
    } else {
      newValues = [...selectedValues, item];
    }

    setSelectedValues(newValues);

    // ✅ نرجع فقط Array of strings من values
    const onlyValues = newValues.map(v => v.value);
    onSelect?.(onlyValues);
  }

  // ✅ فلترة القائمة
  const filteredList = list.filter(el =>
    (el.title ?? el.value).toLowerCase().includes(searchText.toLowerCase())
  );

  // ✅ عرض النص في الحقل
  const displayText =
    selectedValues.length > 0
      ? selectedValues.map(v => v.title ?? v.value).join(', ')
      : placeholder;

  return (
    <div className={Style.input_wrapper} ref={wrapperRef}>
      <label className={Style.input_label}>{label}</label>
      <div
        id={Style.piker}
        className={Style.input_container}
        onClick={() => {
          if (list.length !== 0) {
            setShowPicker(!showPicker);
          }
        }}
      >
        <div className={Style.selected_value}>
          {displayText}
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
                filteredList.map((el, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedValues.some(v => v.id === el.id)}
                        onChange={() => handleToggleValue(el)}
                      />
                    }
                    label={el.title ?? el.value}
                    className={Style.label}
                    onClick={(e) => e.stopPropagation()}
                  />
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

export default MultiDropListComponent;
