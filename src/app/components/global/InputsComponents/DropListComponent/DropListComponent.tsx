import React, { useEffect } from 'react';
import Style from './DropListComponent.module.css';
import { IoIosArrowDown } from "react-icons/io";
import FormGroup from '@mui/material/FormGroup';

interface listType {
  id: number;
  value: string;
  title?: string; // ✅ عرض هذا فقط
}

interface props {
  label: string;
  list: listType[];
  placeholder?: string;
  defaultOption?: listType;
  value?: listType | null; // ✅ القيمة المتحكم فيها من الخارج
  onSelect?: (val: listType) => void; // ✅ عند اختيار عنصر جديد
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

  function handelSelectValue(value: listType) {
    setSelectedValue(value);
    onSelect?.(value); // ✅ بلّغ الأب بالتغيير
    setShowPicker(false);
  }

  return (
    <div className={Style.input_wrapper} onClick={() => setShowPicker(!showPicker)}>
      <label className={Style.input_label}>{label}</label>
      <div id={Style.piker} className={Style.input_container}>
        <div
          className={Style.selected_value}
          onClick={() => setShowPicker(!showPicker)}
        >
          {SelectedValue?.title ?? placeholder}
        </div>
        <IoIosArrowDown onClick={() => setShowPicker(!showPicker)} />

        {showPicker && (
          <div className={Style.options}>
            <div className={Style.title}>
              <p>{label}</p>
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
