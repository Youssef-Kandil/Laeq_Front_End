"use client";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import app_identity from "@/app/config/identity";

const StyledSwitch = styled(Switch)(() => ({
  width: 55,
  height: 36,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    padding: 6,
    transform: "translateX(3px) translateY(1.9px)",
    "&.Mui-checked": {
      transform: "translateX(20px) translateY(1.8px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: app_identity.primary_color,
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 20,
    height: 20,
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
    backgroundColor: "#aaa",
    opacity: 1,
  },
}));

// نخلي الكومبوننت يقبل checked و onCheckedChange زي ما عملنا في plans
interface CustomSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function CustomSwitch({
  checked,
  onCheckedChange,
}: CustomSwitchProps) {
  return (
    <StyledSwitch
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  );
}
