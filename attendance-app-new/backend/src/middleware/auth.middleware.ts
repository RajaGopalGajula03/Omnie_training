import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const verifyAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        console.log("Token from backend",token);        

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: number; role: string; }

        req.user = { id: decoded.id, role: decoded.role };

        next();
    } catch (error) {
        console.error(error); 

        return res.status(401).json({
            message: "Invalid or Expired Token",
        });
    }
};