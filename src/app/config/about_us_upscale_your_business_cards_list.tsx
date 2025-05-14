import { LuHeadset } from "react-icons/lu";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";

const businessCards = [
    {
        icon:<GrCertificate />,
        staticAnalytics:true,
        Analytics:"15+",
        title:"experience"
    },
    {
        icon:<FaUsers />,
        staticAnalytics:false,
        Analytics:244,
        title:"clients"
    },
    {
        icon:<IoShieldCheckmarkOutline />,
        staticAnalytics:false,
        Analytics:300,
        title:"brands"
    },
    {
        icon:<LuHeadset />,
        staticAnalytics:true,
        Analytics:"24/7",
        title:"service"
    },
]

export default businessCards;