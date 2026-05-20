import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware";
import { createLeaveRequest, getLeaveRequests, updateLeaveRequest } from "../controllers/leave.controller";
import { allowRoles } from "../middleware/role.middleware";
import { allowOwnerShip } from "../middleware/ownership.middleware";

const router = Router();

router.get("/",verifyAuth,allowOwnerShip(["Manager","HR"]),getLeaveRequests);

router.post("/",verifyAuth,createLeaveRequest);

router.put("/:id",verifyAuth,allowRoles(["Manager","HR"]),updateLeaveRequest);

export default router;