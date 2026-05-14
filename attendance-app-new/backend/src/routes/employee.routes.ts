import { Router } from "express";
import { createEmployee, deleteEmployee, getEmployees, getSingleEmployee, updateEmployee } from "../controllers/employee.controller";
import { verifyAuth } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";
import { allowOwnerShip } from "../middleware/ownership.middleware";


const router = Router();

router.get("/",verifyAuth,allowRoles(["HR","Manager"]),getEmployees)

router.post("/",verifyAuth,allowRoles(["HR","Manager"]),createEmployee);

router.get("/:id",verifyAuth,allowOwnerShip(["HR","Manager"]),getSingleEmployee);

router.put("/:id",verifyAuth,allowRoles(["HR","Manager"]),updateEmployee)

router.delete("/:id",verifyAuth,allowRoles(["HR","Manager"]),deleteEmployee);

export default router;

