import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.routes";
import loginRoutes from "./routes/login.routes";
import announcementRoutes from "./routes/announcement.routes"

const app = express();

app.use(express.json());

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));

app.use("/api/employees",employeeRoutes);

app.use("/api/login",loginRoutes);

app.use("/api/announcements",announcementRoutes);

export default app;