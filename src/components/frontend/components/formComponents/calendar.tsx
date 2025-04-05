'use client';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarInput({
    func,
    min,
    max
}:{
    func:(value:string)=>void,
    min?:number,
    max?:number
}) {

    const [value, onChange] = useState<Value>(new Date());
    console.log(value)
    return (
        <Calendar onChange={onChange} value={value} />
    )
}