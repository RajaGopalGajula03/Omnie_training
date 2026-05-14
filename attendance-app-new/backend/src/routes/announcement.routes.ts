import { Router } from "express";
import { verifyAuth } from "../middleware/auth.middleware";
import { createAnnouncement, getAnnouncements } from "../controllers/announcement.controller";
import { allowRoles } from "../middleware/role.middleware";

const router = Router();

router.get("/",verifyAuth,getAnnouncements);

router.post("/",verifyAuth,allowRoles(["HR","Manager"]),createAnnouncement);

export default router;