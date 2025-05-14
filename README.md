# Laeq_Front_End
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Youssef-Kandil/Laeq_Front_End.git
git push -u origin main


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




## Date
      const oneDayInMs = 24 * 60 * 60 * 1000; // 86400000 ملي ثانية
      const tenDaysInMs = 7 * oneDayInMs;
      const newTimestamp = Date.now() + tenDaysInMs;
      const date1 = 1744040104837; // مثال لتاريخ 1
      const date2 = new Date("2025-05-08").getTime(); // مثال لتاريخ 2
      const timestamp = new Date(2025, (4 - 1) , 5).getTime();
      console.log("بعد 7 أيام  : ", new Date(newTimestamp).toLocaleString());

const diffInMs = Math.abs(date1 - date2); // الفرق بالملي ثانية
const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // تحويل لأيام

console.log(`الفرق بين التاريخين هو ${diffInDays} يوم`);

✅
## TASKS

    <!-- COMPONENT TO REUSEING -->
    BUTTON  ✅
    TABLE  ✅
    INPUT  ✅
    TextArea ✅
    ImageInput ✅
    MultiImageInput ✅
    ChooseBtn
    ActionBtn
    FileInput ✅
    DropListInput
    CheckBoxeWithLable To Put It In A List ✅
    ScoreInput ✅

      == EASY ==
      - popup  ✅
      - Table Second Button ✅
      - sceleton loader for tables
      - sceleton loader for dashboard 

      - main client Dashboard ✅

      - hash in login and create account form
      - loading and msg  in login and create account form

      - Translate tables and dashboard +++


      ==== MID ====

      - add new action form
      - add new asset form
      - add new user form
      - add new company form
      - add new department form
      - request inspector form
      - request inspector form
      - setting & lang form
      - add new role form
      - add new role permission screen


      ==== MID MAX ===
      - check-lists categories card  ✅
      - check lists row  ✅
      - Table with check boxes ✅
      
      - automation
      - show quiz template
      - answer the quiz
      - add temp -m(add new qestions)

      // ===  unKoune
      - notifications screen
      - show answers in report





        <nav>
            <div className={Styles.pikers}>
                <div className={Styles.input_container} onClick={()=>setShowDatePicker(false)}>
                    <IoIosSearch style={{fontSize:22}}/>
                    <input type="text" placeholder={t("search")} id="" />
                </div>


                <div id={Styles.datePiker} className={Styles.input_container}  >
                    <span className={Styles.dateLable}>{t("date")}</span>
                    <div>
                        {/* <span>{`${formatDate(new Date(startData))} - ${formatDate(new Date(endData))}`}</span> */}
                        <span>{`${formatDate(new Date(range[0].startDate ?? new Date()))} - ${formatDate(new Date(range[0].endDate ?? new Date()))}`}</span>
                    </div>
                    <span onClick={() => {
                        setShowDatePicker(!showDatePicker);
                    }} style={{cursor:'pointer'}}><MdOutlineKeyboardArrowDown/></span>
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


            </div>

            
        </nav>
>>>>>>> 4caca67 (Initial commit)
