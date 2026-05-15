import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware";
import { getAttendance, attendanceAction, } from "../controllers/attendance.controller";

const router = Router();

router.get("/", verifyAuth, getAttendance);

router.post("/", verifyAuth, attendanceAction);

export default router;