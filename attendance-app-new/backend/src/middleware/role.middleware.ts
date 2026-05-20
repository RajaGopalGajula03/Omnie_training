import { Response,NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const allowRoles = (roles:string[])=>{
    return (req:AuthRequest,res:Response,next:NextFunction) =>{

        console.log("Allowed roles",roles);
        console.log("User role",req.user?.role);

        if(!req.user)
        {
            return res.status(401).json({message:"Unauthorized"});
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:"Forbidden"});
        }

        next();

    }
}