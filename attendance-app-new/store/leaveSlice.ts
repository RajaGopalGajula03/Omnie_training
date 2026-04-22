import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

export type Leave={
    id:number;
    employeeId:number;
    leaveType:string;
    fromDate:string;
    toDate:string;
    days:number;
    reason:string;
    status:"pending" | "approved" | "rejected";
};

type LeaveState = {
    leaves:Leave[];
    loading:boolean;
    error:string | null;
};

const initialState : LeaveState = {
    leaves:[],
    loading:false,
    error:null,
} 

export const fetchLeaves = createAsyncThunk(
    "leave/fetch",
    async(employeeId?:number)=>{
        const url = employeeId ? `/api/leave?employeeId=${employeeId}`:`/api/leave`;

        const res = await fetch(url, { credentials: "include" });
        return res.json();
    }
)

export const createLeave = createAsyncThunk(
    "leave/create",
    async(data:{employeeId?: number; leaveType: string; fromDate: string; toDate: string; reason: string})=>{
        const res = await fetch(`/api/leave`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials:"include",
            body:JSON.stringify(data),
        })

        return res.json();
    }
)

export const updateLeaveStatus = createAsyncThunk(
    "leave/update",
    async({id,status}:{id:number,status:string})=>{
        const res = await fetch(`/api/leave/${id}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            credentials:"include",
            body:JSON.stringify({status}),
        })
        return res.json();
    }
)

const leaveSlice = createSlice({
    name:"leave",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        
        .addCase(fetchLeaves.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchLeaves.fulfilled,(state,action)=>{
            state.leaves = action.payload;
            state.loading = false;
        })
        .addCase(createLeave.fulfilled,(state,action)=>{
            state.leaves.unshift(action.payload);
        })
        .addCase(updateLeaveStatus.fulfilled,(state,action)=>{
            const i = state.leaves.findIndex((l)=>l.id === action.payload.id);
            if(i !== -1) state.leaves[i] = action.payload;
        })
    }
})

export default leaveSlice.reducer;
