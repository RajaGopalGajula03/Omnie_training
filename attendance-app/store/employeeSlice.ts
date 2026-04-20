
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

const employeeSlice = createSlice({
    name: "employee",
    initialState: {
        employees: [],
        employee: null,
        attendance: [],
        loading: false,
        error: null as string | null,
    },
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
    }
})

export default employeeSlice.reducer;