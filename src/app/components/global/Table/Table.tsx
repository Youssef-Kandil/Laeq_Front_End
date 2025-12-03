/* eslint-disable @typescript-eslint/no-explicit-any */
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
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import app_identity from '@/app/config/identity';

interface FilterOption {             // اسم الحقل من البيانات (status | level | priority...)
    title: string;             // يظهر في UI
    checked: boolean;          // القيم المتاحة للفلترة
}


interface TableProps {
    titles: string[];
    data?: unknown[];
    rowsFlex?: number[];
    filter?: boolean;
    filterOptions?: FilterOption[];
    dateFilter?: boolean;

    useCheckRows?:boolean;
    onCheckedChange?: (ids: (number | string)[]) => void;

    useRadioRow?:boolean; // ✅ جديد
    onRadioChange?: (id: number | string | null) => void; // ✅ جديد

    navButtonTitle?: string;
    navButtonAction?:()=>void;
    navButton2Title?: string;
    navButton2Action?:()=>void;
}

interface dateRang {
    startDate: Date;
    endDate: Date;
    key: string;
}

function Table({
    titles,
    data,
    rowsFlex,
    filter,
    filterOptions,
    dateFilter,
    navButtonTitle,
    navButtonAction,
    navButton2Title,
    navButton2Action,
    useCheckRows,
    onCheckedChange,
    useRadioRow,
    onRadioChange
}:TableProps) {
    
    const current_lang = useLocale();
    const t = useTranslations('table_component');


    //  ==== SEARSH FILTER ====
    const [search, setSearch] = React.useState("");



    // ==== DATE FILTER ====

    const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
    const [range, setRange] = React.useState<Range[]>([
        { 
          startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // آخر 30 يوم
          endDate: new Date(), // اليوم
          key: 'selection' 
        }
      ]);

    function handleDateRangeChange(
        rangesByKey: RangeKeyDict,
        setRange: (range: dateRang[]) => void,
    ) {
        const selection = rangesByKey.selection;
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

    // ==== STATUS FILTER ====
    interface StatusType { title: string; checked: boolean; }
    const [Status, SetStatus] = React.useState<StatusType[]>(filterOptions??[
        {title:"Completed",checked:false},
        {title:"Pending",checked:false},
        {title:"In_Progress",checked:false},
        {title:"Draft",checked:false},
        {title:"Rejected",checked:false},
        { title: "High", checked: false },
        { title: "Medium", checked: false },
        { title: "Low", checked: false },
    ]);

    const [showFilterPicker, setShowFilterPicker] = React.useState<boolean>(false);

    const handleStatusFilterChange = (status: string) => {
       SetStatus(Status.map((item) => 
          item.title === status ? { ...item, checked: !item.checked } : item
       ));
    };

    const handleResetStatusFilter = ()=> {
        SetStatus([
          {title:"Completed",checked:false},
          {title:"Pending",checked:false},
          {title:"In_Progress",checked:false},
          {title:"Rejected",checked:false},
        ]);
    };

    // ✅ هنا بقى برة خالص (في نفس الكومبوننت مش جوه الفانكشن)
    // === FILTERED DATA (Search + Status) ===

    
    const filteredData = React.useMemo(() => {
        let temp = data ?? [];
    
        // فلترة بالبحث
        if (search.trim() !== "") {
        const lowerSearch = search.toLowerCase();

        temp = temp.filter((row: any) =>
            Object.entries(row).some(([key, value]) => {
            if (key === "status" || key === "level") return false;
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(lowerSearch);
            })
        );
        }
    
        // فلترة بالـ Status
        // const selectedStatuses = Status.filter(s => s.checked).map(s => s.title);
        const selectedStatuses = Status.filter(s => s.checked).map((s)=>{
            return  s.title.replace("_", " ")
        } 
          );
        if (selectedStatuses.length > 0) {

            temp = temp.filter((row: any) =>{
                return selectedStatuses.includes(row.level) || selectedStatuses.includes(row.status)
        }); 
            
        }


         // 📅 فلترة بالتاريخ (لو مفعّلة)

          if (dateFilter && range[0]?.startDate && range[0]?.endDate) {
            const start = new Date(range[0].startDate).getTime();
            const end = new Date(range[0].endDate).getTime();
          
            temp = temp.filter((row: any) => {
              if (!row.date) return false;
          
              // تحويل "16/10/2025" إلى كائن Date صحيح
              const [day, month, year] = row.date.split('/').map(Number);
              const rowDate = new Date(year, month - 1, day).getTime(); // JS months are 0-based
              console.log(start)
              console.log(row.date)
              console.log(rowDate)
              console.log(end)
              return rowDate >= start && rowDate <= end;
            });
          }
          
          
    
        return temp;
    }, [data, search, Status,range,dateFilter]);
  

    // === CHECKBOX SELECTION ===
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
        if (!row.id) return;
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
                setIsAllChecked(false);
                return updated;
            });
        }
    }

    // === RADIO SELECTION ===
    const [selectedRow,setSelectedRow] = React.useState<number | string | null>(null);

    const handleRadioChange = (row: { id: number | string }) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!row.id) return;
        const isChecked = e.target.checked;
        if (isChecked) setSelectedRow(row.id);
        else setSelectedRow(null);
    };

    // === Effects
    React.useEffect(() => {
        if (onCheckedChange) {
            const ids = checkedRows.map(r => r.id);
            onCheckedChange(ids);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedRows]);

    React.useEffect(() => {
        if (onRadioChange) {
            onRadioChange(selectedRow);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow]);

  return (
    <div className={Style.parent} style={{direction:current_lang == "ar" ? "rtl":"ltr"}}>
        <nav>
            <div className={Style.pikers}>
                <div className={Style.input_container}>
                    <IoIosSearch style={{fontSize:22}}/>
                    <input 
                        type="text" 
                        placeholder={t("search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                </div>

                {dateFilter&&(
                    <div id={Style.datePiker} className={Style.input_container}>
                        <span className={Style.dateLable}>{t("date")}</span>
                        <div style={{width:"168px",display:"inline-block"}} className={Style.Range}>
                            <span style={{width:"168px",display:"inline-block"}}>{`${formatDate(new Date(range[0].startDate ?? new Date()))} - ${formatDate(new Date(range[0].endDate ?? new Date()))}`}</span>
                        </div>
                        <span onClick={() => {
                            setShowDatePicker(!showDatePicker);
                            setShowFilterPicker(false);
                        }} style={{cursor:'pointer'}}><MdOutlineKeyboardArrowDown/></span>
                          {/* ✅ زر All Date */}
                            <button
                            onClick={() => {
                                // رجّع الرينج لحالة افتراضية تغطي كل الوقت
                                setRange([
                                {
                                    startDate: new Date(2000, 0, 1),
                                    endDate: new Date(2100, 11, 31),
                                    key: "selection",
                                },
                                ]);
                            }}
                            style={{
                                margin: "10px",
                                padding: "5px 10px",
                                width:"150px",
                                background: app_identity.secondary_color,
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "13px",
                            }}
                            >
                            All Date
                            </button>
                        {showDatePicker && (
                            <div className={Style.dateRange}>
                                <DateRange
                                  editableDateInputs={true}
                                  onChange={(rangesByKey) => handleDateRangeChange(rangesByKey, setRange)}
                                  moveRangeOnFirstSelection={false}
                                  ranges={range}
                                  rangeColors={[app_identity.secondary_color]}
                                />
                            </div>
                        )}
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
                                    {/* ==3 */}
                                    {Status.map((status, index) => (
                                        <FormControlLabel
                                          key={index} 
                                          control={<Checkbox 
                                            value={status.title} 
                                            checked={status.checked} 
                                            onChange={()=>handleStatusFilterChange(status.title)}   
                                            sx={{color:app_identity.secondary_color, '&.Mui-checked':{color:app_identity.secondary_color} }} />} 
                                          label={<span className={Style.label}>{t(`filter_status.${status.title}`)}</span>} 
                                        />
                                    ))}
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
                          sx={{color: app_identity.secondary_color,'&.Mui-checked':{color: app_identity.secondary_color}}}
                        />
                    </div>
                )}
                {useRadioRow && (
                    <div className={Style.title} style={{ flex: FlexCheckBox}} />
                )}
                {titles.map((title, index) => (
                    <div key={index} className={Style.title} style={rowsFlex?.length == 0 || rowsFlex == undefined ?{flex:1}:{flex:rowsFlex[index]}}>
                        {title != "" ?<h1>{t(`client_dashboard.${title}`)}</h1>: <h1>{title}</h1>}
                    </div>
                ))}
            </header>

            <div className={Style.table_body}>
                {filteredData?.map((item, index) => {
                    const row = item as { id: string | number } & Record<string, string | number | boolean | ReactNode>;
                    return (
                        <div key={index} className={Style.row}>
                            {useCheckRows && (
                                <p className={Style.cell} style={{ flex: FlexCheckBox}}>
                                    <Checkbox
                                        checked={checkedRows.some(r => r.id === row.id)}
                                        onChange={row.id ? handelCheckedRow(row) : undefined}
                                        sx={{color: app_identity.secondary_color,'&.Mui-checked':{color: app_identity.secondary_color}}}
                                    />
                                </p>
                            )}
                            {useRadioRow && (
                                <p className={Style.cell} style={{ flex: FlexCheckBox}}>
                                    <Checkbox
                                        // type="radio"
                                        checked={selectedRow === row.id}
                                        onChange={row.id ? handleRadioChange(row) : undefined}
                                        sx={{color: app_identity.secondary_color,'&.Mui-checked':{color: app_identity.secondary_color}}}
                                    />
                                </p>
                            )}
                            {titles.map((_, i) => {
                                const key = Object.keys(row)[i]; 
                                return (
                                    <p key={i} title={""+row[key]} className={Style.cell}  style={rowsFlex?.length == 0 || rowsFlex == undefined ?{flex:1}:{flex:rowsFlex[i]}}>
                                        {(key !== "status" && key !== "level" && key !== "الحالة")  ?  <span>{row[key]}</span> :null}
                                        {(key == "status" || key == "الحالة") && row[key] == "Completed" ?  <span style={{color:"#2AA952",background:"#2AA9521A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                        {(key == "status" || key == "الحالة") && row[key] == "Draft" ?  <span style={{color:"#000000",background:"#0707071a",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                        {(key == "status" || key == "الحالة") && row[key] == "Rejected" ?  <span style={{color:"#ff0707",background:"#ff07071a",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                        {(key == "status" || key == "الحالة") && row[key] == "In Progress" ?  <span style={{color:"#03A9F3",background:"#03A9F31A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                        {(key == "status" || key == "الحالة") && row[key] == "Pending" ?  <span style={{color:"#FFAB07",background:"#FFAB071A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                        
                                        {(key == "level" || key == "المستوي") && row[key] == "Low" ?  <span style={{color:"#2AA952",background:"#2AA9521A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                        {(key == "level" || key == "المستوي") && row[key] == "Medium" ?  <span style={{color:"#FFAB07",background:"#FFAB071A",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                        {(key == "level" || key == "المستوي") && row[key] == "High" ?  <span style={{color:"#ff0707",background:"#ff07071a",padding:8,borderRadius:8,height:33}}>{row[key]}</span> :null}
                                    </p>
                                );
                            })}
                        </div>
                    )
                })}
            </div>
        </section>
    </div>
  )
}

export default Table

