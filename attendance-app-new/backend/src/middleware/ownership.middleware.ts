import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const allowOwnerShip = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (roles.includes(req.user.role)) {
            return next();
        }

        const employeeId = Number(req.params.id);

        if (req.user.id === employeeId) {
            return next();
        }

        return res.status(403).json({message:"Access Denied"});
    }
}