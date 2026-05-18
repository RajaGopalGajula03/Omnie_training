import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware";
import { createLeaveRequest, getLeaveRequests, updateLeaveRequest } from "../controllers/leave.controller";

const router = Router();

router.get("/",verifyAuth,getLeaveRequests);

router.post("/",verifyAuth,createLeaveRequest);

router.put("/:id",verifyAuth,updateLeaveRequest);

export default router;