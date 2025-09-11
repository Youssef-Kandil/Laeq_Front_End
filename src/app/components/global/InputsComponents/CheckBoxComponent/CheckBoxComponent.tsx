"use client";
import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import app_identity from '@/app/config/identity';


interface props {
  label: string;
  disable?: boolean;
  checked?: boolean; // للتحكم في الحالة من بره
  onCheck?: (checked: boolean) => void; // ترجع قيمة التشيك
}

function CheckBoxComponent({label, disable = false, checked, onCheck }:props) {
    const [isChecked, setIsChecked] = React.useState<boolean>(checked ?? false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setIsChecked(newValue);
      if (onCheck) onCheck(newValue);
    };
  return (
      <FormControlLabel 
            control={<Checkbox 
                        disabled={disable}
                        checked={isChecked}
                        onChange={handleChange}
                        sx={{
                            color: app_identity.secondary_color,
                            '&.Mui-checked': {
                                color: app_identity.secondary_color
                            }
                        }} />
            } 
            label={label}
            sx={{
                marginLeft: 0,
                '.MuiFormControlLabel-label': {
                  fontWeight: 500,
                  fontSize: 12,
                  lineHeight: '100%',
                  letterSpacing: 0,
                  textAlign: 'center',
                  color:'rgba(50, 49, 53, 1)',
                },
              }} />
  )
}

export default CheckBoxComponent
