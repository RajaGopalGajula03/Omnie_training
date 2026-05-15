import express from "express";
import { verifyAuth, AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/check", verifyAuth, (req: AuthRequest, res) => {
   return res.json({
      authenticated: true,
      user: req.user,
   });
});

export default router;