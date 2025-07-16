import React from 'react'

interface props{
    label:string;
    value:string;
}

function Text({label,value}:props) {
  return (
    <div>
        <label>{label}</label>
        <p>{value}</p>
    </div>
  )
}

export default Text
