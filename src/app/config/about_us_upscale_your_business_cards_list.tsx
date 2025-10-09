import { LuHeadset } from "react-icons/lu";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";

const businessCards = [
    {
        icon:<GrCertificate />,
        staticAnalytics:true,
        Analytics:"8+",
        title:"experience"
    },
    {
        icon:<FaUsers />,
        staticAnalytics:false,
        Analytics:90,
        title:"MEMBERS"
    },
    {
        icon:<IoShieldCheckmarkOutline />,
        staticAnalytics:false,
        Analytics:"+490",
        title:"Trusted by Leading Brands"
    },
    {
        icon:<LuHeadset />,
        staticAnalytics:true,
        Analytics:"24/7",
        title:"Fulltime customer service"
    },
]

export default businessCards;