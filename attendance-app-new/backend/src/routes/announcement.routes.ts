import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware";
import { createAnnouncement, getAnnouncements, updateAnnouncement } from "../controllers/announcement.controller";
import { allowRoles } from "../middleware/role.middleware";

const router = Router();

router.get("/",verifyAuth,getAnnouncements);

router.post("/",verifyAuth,allowRoles(["HR","Manager"]),createAnnouncement);

router.put("/",verifyAuth,allowRoles(["HR","Manager"]),updateAnnouncement)

export default router;