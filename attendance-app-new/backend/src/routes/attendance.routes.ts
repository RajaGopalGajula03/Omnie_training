import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware";
import { getMyAttendance, getAttendance, checkIn, checkOut, adminUpdateAttendance, } from "../controllers/attendance.controller";
import { allowRoles } from "../middleware/role.middleware";
import { allowOwnerShip } from "../middleware/ownership.middleware";

const router = Router();

router.get("/me", verifyAuth, getMyAttendance);

router.get("/", verifyAuth,allowRoles(["Manager","HR"]), getAttendance);

router.post("/check-in",verifyAuth,allowOwnerShip(["Manager","HR"]),checkIn);

router.post("/check-out",verifyAuth,allowOwnerShip(["Manager","HR"]),checkOut);

router.put("/admin-update",verifyAuth,allowRoles(["Manager", "HR"]),adminUpdateAttendance);

export default router;