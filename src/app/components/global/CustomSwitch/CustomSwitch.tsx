"use client";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import app_identity from '@/app/config/identity';


const CustomSwitch = styled(Switch)(({  }) => ({
  width: 55,
  height: 36,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    padding: 6,
    transform: 'translateX(3px) translateY(1.9px)',
    '&.Mui-checked': {
      transform: 'translateX(20px) translateY(1.8px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: app_identity.primary_color,
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 20,
    height: 20,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    borderRadius: 20,
    backgroundColor: '#aaa',
    opacity: 1,
  },
}));

export default CustomSwitch;