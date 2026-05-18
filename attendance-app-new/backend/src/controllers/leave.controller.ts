import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createLeaveRequestService, getLeaveRequestService, updateLeaveRequestService } from "../services/leave.service";


const ADMIN_ROLES = ["Manager","HR"];

export const getLeaveRequests = async(req:AuthRequest,res:Response) =>{

    try{
        const employeeIdParam = req.query.employeeId as string;
        
        const isAdmin = ADMIN_ROLES.includes(req.user!.role);

        if(employeeIdParam && !isAdmin && Number(employeeIdParam) !== req.user!.id)
        {
            return res.status(403).json({message:"You can only view your own leave request"});
        }

        const result = await getLeaveRequestService(req.user!,employeeIdParam?Number(employeeIdParam) : undefined);

        return res.status(200).json(result);
    }
    catch(error)
    {
        console.error(error);

        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const createLeaveRequest = async(req:AuthRequest,res:Response) =>{
    try{
        const result = await createLeaveRequestService(req.user!,req.body);

        return res.status(201).json({message:"Leave Request Created Successfully",id:result.insertId});

    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json("Internal Server Error");
    }
}

export const updateLeaveRequest = async(req:AuthRequest,res:Response) =>{
    try{
        const leaveId = Number(req.params.id);
        
        if(Number.isNaN(leaveId))
        {
            return res.status(400).json({message:"Invalid Leave Id"});
        }

        const isAdmin = ADMIN_ROLES.includes(req.user!.role);

        if(!isAdmin)
        {
            return res.status(403).json({
                message:"Only Admin's can update leave Status"
            })
        }

        const result = await updateLeaveRequestService(leaveId,req.body,req.user!.id);

        return res.status(result.statusCode).json(result.data);

    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}