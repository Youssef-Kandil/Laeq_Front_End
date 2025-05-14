"use client";
import React from 'react'
import Styles from './ScoreInputComponent.module.css'
import app_identity from '@/app/config/identity';

interface boxProp{
  value:string
  onClick:()=>void;
  isSelected:boolean;
}

function ScoreInputComponent() {

  type ScoreValue = '1' | '2' | '3' | '4' | '5';
  const Boxs :ScoreValue[] = ["1","2","3","4","5"];
  const [SelectedBox,setSelectedBox] = React.useState<ScoreValue | null>(null)

  React.useEffect(()=>{
    console.log("boxValue : ",SelectedBox)
  },[SelectedBox])
  
  return (
    <div className={Styles.ScoreInput}>
      <span>Score</span>
      <div  className={Styles.boxsContainer}>
        {Boxs.map((boxValue)=>{
          return <Box isSelected={SelectedBox == boxValue} onClick={()=>setSelectedBox(boxValue)} value={boxValue}/>
        })}
      </div>
    </div>
  )
}

function Box ({value,onClick,isSelected}:boxProp){
  return(
    <div 
      className={Styles.Box}  
      onClick={onClick}
      style={isSelected?{background:app_identity.secondary_color,color:"#FFF"}:{}}>
      <span>{value}</span>
    </div>
  )
} 

export default ScoreInputComponent
