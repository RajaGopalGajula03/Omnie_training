import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware";
import { createPayroll, getPayrolls, updatePayroll } from "../controllers/payroll.controller";
import { allowRoles } from "../middleware/role.middleware";
import { allowOwnerShip } from "../middleware/ownership.middleware";



const router = Router();

router.get("/",verifyAuth,allowOwnerShip(["Manager","HR"]),getPayrolls);

router.post("/",verifyAuth,allowRoles(["Manager","HR"]),createPayroll);

router.put("/:id",verifyAuth,allowRoles(["Manager","HR"]),updatePayroll);

export default router;