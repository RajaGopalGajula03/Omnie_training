import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.routes";
import loginRoutes from "./routes/login.routes";
import announcementRoutes from "./routes/announcement.routes"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import attendanceRoutes from "./routes/attendance.routes";
import leaveRoutes from "./routes/leave.routes";


const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use("/api/employees", employeeRoutes);

app.use("/api/login", loginRoutes);

app.use("/api/announcements", announcementRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/leaves",leaveRoutes)

export default app;