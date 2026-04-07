"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {addTodo, deleteTodo} from "@/redux/todoSlice";
import { Button, TextField } from "@mui/material";


export default function TodoPage(){
    const [task,setTask] = useState("");


    const todos = useSelector((state)=>state.todo.todos);
    const dispatch = useDispatch();

    function handleAddTask(){
        if(!task)
            return;
        dispatch(addTodo(task));
        setTask("");
    }

    return(
        <div>
            <h2>Todo App</h2>
            <TextField 
            size="small"
            value={task}
            onChange={(e)=>setTask(e.target.value)}
            placeholder="Enter Task"
            >
            </TextField>
            <Button sx={{ml:3}} variant="contained" onClick={handleAddTask}>Add Task</Button>
            <ul>
                {todos.map((todo)=>(
                    <li key={todo.id}><span>{todo.text}</span><Button color="error" variant="contained" sx={{ml:3}} onClick={()=>dispatch(deleteTodo(todo.id))}>Delete</Button></li>
                ))}
            </ul>
        </div>
    )
}