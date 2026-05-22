import express from "express";
import { verifyAuth, AuthRequest } from "../middleware/auth.middleware";
import { logout } from "../controllers/auth.controller";
import { db } from "../config/db";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/check", verifyAuth, async(req: AuthRequest, res) => {

   const[rows] = await db.execute<RowDataPacket[]>(
      `SELECT id,name,email,role FROM employees WHERE id = ? AND deleted_at IS NULL`,[req.user!.id]
   )
   const user = rows[0];
   if(!user){
      return res.status(401).json({message:"Unauthorized"});
   }

   return res.json({
      authenticated: true,
      user,
   });
});

router.post("/logout",verifyAuth,logout);

export default router;