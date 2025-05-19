"use client";
import React ,{useState} from 'react'
import Styles from './singleChoice.module.css'


interface opthionsType{
    label:string;
    value:number
}

interface props{
    options:opthionsType[];
    onChoose?:(selectedChoice:number)=>void;
}

function SingleChoiceAnswer({options}:props) {
    const [selectedChoice,setSelectedChoice] = useState<number|null>(null)

    function handelChoicesStyles(value:number){
        //  === YES
        if(value == 1 && selectedChoice == value){
            return {color:"#fff",background:"rgba(104, 166, 166, 1)"}
        }
        //  === NO
        if(value == 0 && selectedChoice == value){
            return {color:"#fff",background:"rgba(229, 21, 25, 1)"}
        }
        //  === N/A
        if(value == -1 && selectedChoice == value){
            return {color:"#fff",background:"rgba(238, 201, 12, 1)"}
        }
    }

    const Coices = options.map((choice,index)=>{
            return <span 
                    key={index} 
                    onClick={()=>setSelectedChoice(choice.value)} 
                    style={handelChoicesStyles(choice.value)}
                    >
                        {choice.label}
                    </span>
    })

  return (
    <div className={Styles.Choices}>
        {Coices}
    </div>
  )
}

export default SingleChoiceAnswer
