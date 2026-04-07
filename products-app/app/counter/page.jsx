"use client";

import { decrement, increment, reset } from "@/redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Home(){
  const count = useSelector((state)=> state.counter.value);
  const dispatch = useDispatch();

  return(
    <div>
      <h1>Counter : {count}</h1>
      <button style={{marginRight:20}} onClick={()=> dispatch(increment())}>+</button>
      <button style={{marginRight:20}} onClick={()=> dispatch(decrement())} disabled={count === 0}>-</button>
      <button onClick={()=>dispatch(reset())}>Reset</button>
    </div>
  )
}