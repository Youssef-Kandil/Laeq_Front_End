"use client";
import dynamic from 'next/dynamic'; 
// 3️⃣ عرّف المكوّن بشكل ديناميكي مع تعطيل SSR
export const ClientOnlyTable = dynamic(() => import('./Table'), {
    ssr: false,
});

import React, { ReactNode } from 'react'
import Style from './table.module.css'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import {formatDate} from '@/app/utils/date';
import { IoIosSearch } from "react-icons/io";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import {useTranslations,useLocale} from 'next-intl';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";


import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // style الأساسي
import 'react-date-range/dist/theme/default.css'; // الثيم
import app_identity from '@/app/config/identity';


interface TableProps {
    titles: string[];
    data?: unknown[];

    rowsFlex?: number[];

    filter?: boolean;
    filterOptions?: string[];
    dateFilter?: boolean;

    useCheckRows?:boolean;
    onCheckedChange?: (ids: (number | string)[]) => void;

    navButtonTitle?: string;
    navButtonAction?:()=>void;

    navButton2Title?: string;
    navButton2Action?:()=>void;

}

interface  dateRang{
    startDate: Date;
    endDate: Date;
    key: string;
}



function Table({
    titles,
    data,
    rowsFlex,
    filter,
    dateFilter,
    navButtonTitle,
    navButtonAction,
    navButton2Title,
    navButton2Action,
    useCheckRows,onCheckedChange}:TableProps) {
    
    
    const current_lang = useLocale();
    const t = useTranslations('table_component');
    // ==== START DATE FILTER LOGIC ====
    const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
    const [range, setRange] = React.useState<Range[]>([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);


      function handleDateRangeChange(
        rangesByKey: RangeKeyDict,
        setRange: (range: dateRang[]) => void,
      ) {
        const selection = rangesByKey.selection;
      
        // تأكد من أن التواريخ معرفة وليست undefined
        if (selection.startDate && selection.endDate) {
          const newRange: dateRang[] = [
            {
              startDate: selection.startDate,
              endDate: selection.endDate,
              key: selection.key ?? "defaultKey",
            },
          ];
          setRange(newRange);
        }
      }
    // ==== END DATE FILTER LOGIC ====

    // ==== START STATUS FILTER LOGIC ====
    interface StatusType {
        title: string;
        checked: boolean;
    }
    const [Status, SetStatus] = React.useState<StatusType[]>([
        {title:"completed",checked:false},
        {title:"pending",checked:false},
        {title:"in_progress",checked:false}
    ]);




    const [showFilterPicker, setShowFilterPicker] = React.useState<boolean>(false);

    const [completedChecked, seCtompletedChecked] = React.useState<boolean>(false);
    const [pendingChecked, setPendingChecked] =React. useState<boolean>(false);
    const [inProgressChecked, setInProgressChecked] = React.useState<boolean>(false);

    

      
    const handleStatusFilterChange = (status: string) => {
       if (status == "completed") {
          seCtompletedChecked(!completedChecked);
          SetStatus(Status.map((item, idx) => 
            idx === 0 ? { ...item, checked: !item.checked } : item
          ));
       }
       if (status == "pending") {
          setPendingChecked(!pendingChecked);
          SetStatus(Status.map((item, idx) => 
            idx === 1 ? { ...item, checked: !item.checked } : item
          ));
       }
       if (status == "in_progress") {
          setInProgressChecked(!inProgressChecked);
            SetStatus(Status.map((item, idx) => 
                idx === 2 ? { ...item, checked: !item.checked } : item
            ));
       }
    };

    const handleResetStatusFilter = ()=> {
        console.log("reset");
            seCtompletedChecked(false);
            setPendingChecked(false);
            setInProgressChecked(false);
            
          SetStatus([{
            title:"completed",
            checked:false
          },
          {
            title:"pending",
            checked:false
          },
          {
            title:"in_progress",
            checked:false
          }]);


    };

    // ==== END STATUS FILTER LOGIC ====



    // === Handel Check Boxes ====
    const FlexCheckBox:number = 0.3;
    const [isAllChecked, setIsAllChecked] = React.useState<boolean>(false);
    const [checkedRows,setCheckedRows] = React.useState<{ id: number | string }[]>([]);
    const handelCheckAll = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const checked = e.target.checked;
        setIsAllChecked(checked);
        if (checked && data) {
            const allRows = data.map((row) => {
                const r = row as { id: number | string };
                return { id: r.id };
            });
            setCheckedRows(allRows);
        } else {
            setCheckedRows([]);
        }
    }
    const handelCheckedRow = (row: { id: number | string })=> (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!row.id) {
            console.warn("الصف لا يحتوي على id");
            return;
        }
        
        const isChecked = e.target.checked;
        if (isChecked) {
            setCheckedRows(prev => {
                const updated = [...prev, row];
                if (updated.length === data?.length) setIsAllChecked(true);
                return updated;
            });
        } else {
            setCheckedRows(prev => {
                const updated = prev.filter(item => item.id !== row.id);
                setIsAllChecked(false); // أي إلغاء تشيك يلغي الـ Select All
                return updated;
            });
        }

    }


    React.useEffect(() => {
        const ids = checkedRows.map(r => r.id);
        console.log("Checked IDs ::", ids);
        if (onCheckedChange) onCheckedChange(ids); // 👈 هنا بيرجع الـ IDs للـ parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedRows]);
      



      

  return (
    <div className={Style.parent} style={{direction:current_lang == "ar" ? "rtl":"ltr"}}>
        <nav>
            <div className={Style.pikers}>
                <div className={Style.input_container}>
                    <IoIosSearch style={{fontSize:22}}/>
                    <input type="text" placeholder={t("search")} id="" />
                </div>

                    {dateFilter&&(
                        <div id={Style.datePiker} className={Style.input_container}  >
                            <span className={Style.dateLable}>{t("date")}</span>
                            <div>
                                {/* <span>{`${formatDate(new Date(startData))} - ${formatDate(new Date(endData))}`}</span> */}
                                <span>{`${formatDate(new Date(range[0].startDate ?? new Date()))} - ${formatDate(new Date(range[0].endDate ?? new Date()))}`}</span>
                            </div>
                            <span onClick={() => {
                                setShowDatePicker(!showDatePicker);
                                setShowFilterPicker(false);
                            }} style={{cursor:'pointer'}}><MdOutlineKeyboardArrowDown/></span>
                            {/* ========= */}
                                {showDatePicker && (
                                    <div className={Style.dateRange}>
                                        <DateRange
                                        editableDateInputs={true}
                                        // onChange={(item: { selection: dateRang }) => setRange([item.selection])}
                                        onChange={(rangesByKey) => handleDateRangeChange(rangesByKey, setRange)}
                                        moveRangeOnFirstSelection={false}
                                        ranges={range}
                                        rangeColors={[app_identity.secondary_color]}
                                        />
                                    </div>
                                )}
                            {/* ================== */}
                        </div>
                    )}
                    
                    {filter&&(
                        <div id={Style.FiltersPiker}  className={Style.input_container}>
                            <HiAdjustmentsHorizontal onClick={()=>{
                                setShowFilterPicker(!showFilterPicker)
                                setShowDatePicker(false);
                            }}/>
                            <div onClick={()=>{
                                setShowFilterPicker(!showFilterPicker)
                                setShowDatePicker(false);
                            }}>
                                {t("filter")}
                            </div>

                            {showFilterPicker && (
                                <div className={Style.filterOptions}>
                                    <div className={Style.title}>
                                        <p>{t("filter_status.title")}</p>
                                        <p className={Style.reset} onClick={()=>handleResetStatusFilter()}>{t("filter_status.reset")}</p>
                                    </div>

                                    <FormGroup className={Style.checkBoxGroup}>
                                        {Status.map((status, index) => {
                                            return (
                                                <FormControlLabel
                                                key={index} 
                                                control={<Checkbox 
                                                            value={status.title} 
                                                            checked={status.checked} 
                                                            onChange={()=>handleStatusFilterChange(status.title? status.title:"")}   
                                                            sx={{color:app_identity.secondary_color, '&.Mui-checked':{color:app_identity.secondary_color} }} />} 
                                                label={<span className={Style.label}>{t(`filter_status.${status.title}`)}</span>} />

                                            )
                                        })}
                            
                                    </FormGroup>
                                </div>
                            )}
                        </div>
                    )}
            </div>
            
            {navButton2Title && (
                <div className={Style.button2}>
                    <button style={{cursor:"pointer"}} onClick={navButton2Action}>{t(`client_dashboard.${navButtonTitle}.button_title2`)}</button>
                </div>
            )}

            {navButtonTitle && (
                <div className={Style.button}>
                    <button style={{cursor:"pointer"}} onClick={navButtonAction}>{t(`client_dashboard.${navButtonTitle}.button_title`)}</button>
                </div>
            )}

            
        </nav>

        <section>          
            <header>
                {useCheckRows && (
                    
                    <div className={Style.title} style={{ flex: FlexCheckBox}}>
                        <Checkbox
                                checked={isAllChecked}
                                onChange={handelCheckAll}
                                sx={{
                                    color: app_identity.secondary_color,
                                    '&.Mui-checked': {
                                        color: app_identity.secondary_color
                                    }
                                }}
                        />
                        
                    </div>
                )}               
                {titles.map((title, index) => {
                    return (
                        <div key={index} className={Style.title} style={rowsFlex?.length == 0 || rowsFlex == undefined ?{flex:1}:{flex:rowsFlex[index]}}>
                            {title != "" ?<h1>{t(`client_dashboard.${title}`)}</h1>: <h1>{title}</h1>}
                        </div>
                    )
                  })
                }
            </header>
            <div  className={Style.table_body}>
    {/*  RENDER ROWS */}
                {data?.map((item, index) => {
                    const row = item as { id: string | number } & Record<string, string | number | boolean | ReactNode>;

                    return (
                        <div key={index} className={Style.row}>
    {/* RENDER USE CHECK BOX CELLS */}
                            {useCheckRows && (
                                        <p className={Style.cell}style={{ flex: FlexCheckBox}}>
                                            <Checkbox
                                                checked={checkedRows.some(r => r.id === row.id)}
                                                onChange={row.id ? handelCheckedRow(row) : undefined}
                                                sx={{
                                                    color: app_identity.secondary_color,
                                                    '&.Mui-checked': {
                                                        color: app_identity.secondary_color
                                                    }
                                                }}
                                            />
                                        </p>
                                    )}
    {/* RENDER STATUS & NORMAL CELLS */}
                            {titles.map((_, i) => {
                            const key = Object.keys(row)[i]; // افترض إن ترتيب المفاتيح في الكائن زي ترتيب العناوين
                            return (
                                <p key={i} title={""+row[key]} className={Style.cell}  style={rowsFlex?.length == 0 || rowsFlex == undefined ?{flex:1}:{flex:rowsFlex[i]}}>
                                    {/* === NORMAL CELL === */}
                                    {(key !== "status" && key !== "الحالة")  ?  <span>{row[key]}</span> :null}
                                    {/* === STATUS CELLS === */}
                                    {(key == "status" || key == "الحالة") && row[key] == "Completed" ?  <span style={{color:"#2AA952",background:"#2AA9521A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                    {(key == "status" || key == "الحالة") && row[key] == "In Progress" ?  <span style={{color:"#03A9F3",background:"#03A9F31A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                    {(key == "status" || key == "الحالة") && row[key] == "Pending" ?  <span style={{color:"#FFAB07",background:"#FFAB071A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                   
                                </p>
                            );
                            })}

                        </div>
                    )
                })}
            </div>

        </section>

        {/* <footer>
            <button type="button"><IoMdArrowBack/>{t("tbfooter.previous")}</button>
            <div className={Style.pageNumbers}>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>...</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
            </div>
            <button type="button">{t("tbfooter.next")}<IoMdArrowForward/></button>
        </footer> */}
    </div>
  )
}

export default Table
