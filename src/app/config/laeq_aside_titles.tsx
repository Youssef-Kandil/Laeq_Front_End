import { GoChecklist , GoCreditCard } from "react-icons/go";
import { MdOutlinePendingActions } from "react-icons/md";
// import { LuBuilding } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { TbReportAnalytics ,TbUserShield } from "react-icons/tb";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { BsBuildingCheck } from "react-icons/bs";
import { MdTaskAlt } from "react-icons/md";




const iconSize = 20

const aside_titles =[
    {
        title:"dashboard", // This Title Is A Key Fom Locale Folder
        href:"/summeries",
        permission_name:"show summeries",
        icon:<HiOutlineViewGridAdd  style={{fontSize:iconSize}} />,
        isActive:true,
        hasChild:false,
    },
    {
        title:"checklist",
        href:"/checklist",
        permission_name:"assign checklist to users",
        icon:<GoChecklist style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"tasks",
        href:"/tasks",
        permission_name:"ask tasks",
        icon:<MdTaskAlt style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"reports",
        href:"/reports",
        permission_name:"show checklists reports",
        icon:<TbReportAnalytics style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"actions",
        href:"/actions",
        permission_name:"manage actions",
        icon:<MdOutlinePendingActions style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"assets",
        href:"/assets",
        permission_name:"show assets",
        icon:<HiOutlineArchiveBox style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"Inspectors",
        href:"/Inspectors",
        permission_name:"show users",
        icon:<FaRegUser style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"roles",
        href:"/roles",
        permission_name:"roles",
        icon:<TbUserShield style={{fontSize:iconSize}}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"company",
        href:"/company",
        permission_name:"show companies",
        icon:<GoChecklist style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"inspector_requests",
        href:"/inspector_requests",
        permission_name:"ask inspector requests",
        icon:<BsBuildingCheck style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"Subscriptions",
        href:"/Subscriptions",
        permission_name:"show current payment plan",
        icon:<GoCreditCard style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"payments_plans",
        href:"/payments_plans",
        permission_name:"show current payment plan",
        icon:<GoCreditCard style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
    {
        title:"settings",
        href:"/settings",
        permission_name:"settings",
        icon:<IoSettingsOutline style={{fontSize:iconSize }}/>,
        isActive:false,
        hasChild:false,
    },
]

export default aside_titles