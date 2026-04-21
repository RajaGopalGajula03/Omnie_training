
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchEmployees = createAsyncThunk(
    "employee/fetchEmployees",
    async (_, { rejectWithValue }) => {
        const res = await fetch("/api/employees");

        if (res.status === 401) {

            return rejectWithValue("unauthorized");
        }
        if (!res.ok) {
            throw new Error("Failed to fetch employees");
        }
        return res.json();
    }
);

export const fetchEmployeeDetails = createAsyncThunk(
    "employee/fetchEmployeeDetails",
    async (id: string) => {
        const empRes = await fetch(`/api/employees/${id}`);
        const empData = await empRes.json();

        const month = new Date().toISOString().slice(0, 7);
        const attRes = await fetch(`/api/attendance?userId=${id}&month=${month}`);
        const attData = await attRes.json();

        return { empData, attData };
    }
)
// export const updateEmployee = createAsyncThunk(
//     "employee/updateEmployee",
//     async (
//         { id, data }: { id: number; data: Partial<Employee> },
//         { rejectWithValue }
//     ) => {
//         const res = await fetch(`/api/employees/${id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify(data),
//         });

//         if (res.status === 401) {
//             return rejectWithValue("unauthorized");
//         }

//         if (!res.ok) {
//             return rejectWithValue("Update failed");
//         }

//         return res.json();
//     }
// );

export type Attendance = {
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: string;
};

export type Employee = {
    id: number;
    name: string;
    email: string;
    role: string;
    projects: string[];
};

type EmployeeState = {
    attendance: Attendance[];
    employees: Employee[];
    employee: Employee | null;
    loading: boolean;
    error: string | null;
};



const initialState: EmployeeState = {
    attendance: [],
    employees: [],
    employee: null,
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload;
                state.loading = false;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchEmployeeDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
                state.employee = action.payload.empData;
                state.attendance = action.payload.attData;
                state.loading = false;
            })
            .addCase(fetchEmployeeDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // .addCase(updateEmployee.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(updateEmployee.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.employee = action.payload;

            //     const index = state.employees.findIndex(
            //         (e) => e.id === action.payload.id
            //     );

            //     if (index !== -1) {
            //         state.employees[index] = action.payload;
            //     }
            // })
            // .addCase(updateEmployee.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload as string;
            // })
    }
})

export default employeeSlice.reducer;
