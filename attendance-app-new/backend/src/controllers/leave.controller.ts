import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createLeaveRequestService, getLeaveRequestService, updateLeaveRequestService } from "../services/leave.service";


export const getLeaveRequests = async (req: AuthRequest, res: Response) => {

    try {
        const employeeIdParam = req.query.employeeId as string;

        if (employeeIdParam && Number.isNaN(Number(employeeIdParam))) {
            return res.status(400).json({
                message: "Invalid Employee Id",
            });
        }

        const isAdmin = req.user!.role === "Manager" || req.user!.role === "HR";

        const employeeId = isAdmin ? employeeIdParam ? Number(employeeIdParam) : undefined : req.user!.id;

        const result = await getLeaveRequestService(employeeId);

        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createLeaveRequest = async (req: AuthRequest, res: Response) => {
    try {
        const result = await createLeaveRequestService(req.user!, req.body);

        return res.status(201).json({ message: "Leave Request Created Successfully", id: result.insertId });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateLeaveRequest = async (req: AuthRequest, res: Response) => {
    try {
        const leaveId = Number(req.params.id);

        if (Number.isNaN(leaveId)) {
            return res.status(400).json({ message: "Invalid Leave Id" });
        }

        const result = await updateLeaveRequestService(leaveId, req.body, req.user!.id);

        return res.status(result.statusCode).json({message:result.message,data:result.data});

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}