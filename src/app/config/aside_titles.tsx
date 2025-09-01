import { GoChecklist , GoCreditCard } from "react-icons/go";
// import { MdOutlinePendingActions } from "react-icons/md";
// import { LuBuilding } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { TbReportAnalytics ,TbUserShield } from "react-icons/tb";
import { HiOutlineViewGridAdd } from "react-icons/hi";
// import { HiOutlineArchiveBox } from "react-icons/hi2";
// import { BsBuildingCheck } from "react-icons/bs";
import { MdTaskAlt } from "react-icons/md";




const iconSize = 20

const aside_titles =[
    {
        title:"dashboard", // This Title Is A Key Fom Locale Folder
        href:"/summeries",
        icon:<HiOutlineViewGridAdd  style={{fontSize:iconSize}} />,
        isActive:true,
        hasChild:false,
    },
    {
        title:"checklist",
        href:"/checklist",
        icon:<GoChecklist style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"tasks",
        href:"/tasks",
        icon:<MdTaskAlt style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"reports",
        href:"/reports",
        icon:<TbReportAnalytics style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    // {
    //     title:"actions",
    //     href:"/actions",
    //     icon:<MdOutlinePendingActions style={{fontSize:iconSize}}/>,
    //     isActive:false,
    //     hasChild:false,
    // },
    // {
    //     title:"assets",
    //     href:"/assets",
    //     icon:<HiOutlineArchiveBox style={{fontSize:iconSize}}/>,
    //     isActive:false,
    //     hasChild:false,
    // },
    {
        title:"users",
        href:"/users",
        icon:<FaRegUser style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"roles",
        href:"/roles",
        icon:<TbUserShield style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"company",
        href:"/company",
        icon:<GoChecklist style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
    // {
    //     title:"department",
    //     href:"/department",
    //     icon:<LuBuilding style={{fontSize:iconSize }}/>,
    //     isActive:false,
    //     hasChild:false,
    // },
    // {
    //     title:"inspector_requests",
    //     href:"/inspector_requests",
    //     icon:<BsBuildingCheck style={{fontSize:iconSize }}/>,
    //     isActive:false,
    //     hasChild:false,
    // },
    {
        title:"payments_plans",
        href:"/payments_plans",
        icon:<GoCreditCard style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"settings",
        href:"/settings",
        icon:<IoSettingsOutline style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
]

export default aside_titles