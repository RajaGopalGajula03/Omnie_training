import { Request, Response } from "express";

export const logout = async(_req:Request,res:Response) =>{
    try{
        res.clearCookie("token",{
            httpOnly:true,
            sameSite:"lax",
            secure:process.env.NODE_ENV === "production",
            path:"/",
        })

        return res.status(200).json({
            message:"Logged out Successfully",
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"}); 
    }
}