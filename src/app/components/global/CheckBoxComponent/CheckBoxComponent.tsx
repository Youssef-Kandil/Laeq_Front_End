"use client";
import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import app_identity from '@/app/config/identity';

interface props{
    label:string;
    disable?:boolean
    onCheck?:()=>void;
}

function CheckBoxComponent({label,disable=false}:props) {
  return (
      <FormControlLabel 
            control={<Checkbox 
                        disabled={disable}
                        // defaultChecked
                        // checked={isAllChecked}
                        // onChange={handelCheckAll}
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
