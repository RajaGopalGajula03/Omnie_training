import express from "express";
import { verifyAuth, AuthRequest } from "../middleware/auth.middleware";
import { logout } from "../controllers/auth.controller";

const router = express.Router();

router.get("/check", verifyAuth, (req: AuthRequest, res) => {
   return res.json({
      authenticated: true,
      user: req.user,
   });
});

router.post("/logout",verifyAuth,logout);

export default router;