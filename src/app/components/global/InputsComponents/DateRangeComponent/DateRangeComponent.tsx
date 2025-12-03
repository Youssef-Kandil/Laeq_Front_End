"use client";
import React from 'react'
import Styles from './dateRangeComponent.module.css'


import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // style الأساسي
import 'react-date-range/dist/theme/default.css'; // الثيم
import app_identity from '@/app/config/identity';
import { formatDate } from '@/app/utils/date';

import { HiCalendarDateRange } from "react-icons/hi2";


interface  dateRang{
    startDate: Date;
    endDate: Date;
    key: string;
}

function DateRangeComponent() {
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
  return (
        <div id={Styles.datePiker} className={Styles.input_container}  >
                <span className={Styles.dateLable}>Date : </span>
            <div>
                <span>{`${formatDate(new Date(range[0].startDate ?? new Date()))} - ${formatDate(new Date(range[0].endDate ?? new Date()))}`}</span>
            </div>
            <span onClick={() => {
                setShowDatePicker(!showDatePicker);
            }} style={{cursor:'pointer'}}><HiCalendarDateRange size={25} color={app_identity.secondary_color}/></span>
            {/* ========= */}
                {showDatePicker && (
                    <div className={Styles.dateRange}>
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
  )
}

export default DateRangeComponent
