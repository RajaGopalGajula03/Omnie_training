import { Request, Response } from "express";
import { createEmployeeService, deleteEmployeeService, getEmployeesService, getSingleEmployeeService, restoreEmployeeService, updateEmployeeService } from "../services/employee.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await getEmployeesService();

        return res.json(employees);
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const createEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const body = req.body;

        if (!body.name || !body.email || !body.password || !body.role || !body.department_id) {
            return res.status(400).json({ message: "Missing Required Fields" });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const employee = await createEmployeeService(body, req.user.id);

        if (!employee.success) {
            return res.status(409).json({
                message: employee.message
            });
        }

        return res.status(201).json(employee);
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Server Error" })
    }
}

export const getSingleEmployee = async (req: Request, res: Response) => {
    try {
        const employeeId = Number(req.params.id);

        const employee = await getSingleEmployeeService(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Employee Not Found" })
        }

        return res.status(200).json(employee);
    }
    catch (error) {
        console.error(error)

        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const body = req.body;

        const employeeId = Number(req.params.id)

        if (!body.name || !body.email || !body.role || !body.department_id) {
            return res.status(400).json({ message: "Missing Required Fields" });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const employee = await updateEmployeeService(employeeId, body, req.user.id);

        if (!employee.success) {
            return res.status(409).json({
                message: employee.message
            });
        }

        return res.status(200).json(employee);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const employeeId = Number(req.params.id);

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const employee = await deleteEmployeeService(employeeId, req.user.id);

        if (!employee) {
            return res.status(404).json({ message: "Employee Not Found" });
        }

        return res.status(200).json(employee);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const restoreEmployee = async(req:AuthRequest,res:Response) =>{
    try{
        const employeeId = Number(req.params.id);

        if(!req.user)
        {
            return res.status(401).json({message:"Unauthorized"});
        }

        const employee = await restoreEmployeeService(employeeId,req.user.id);

        if(!employee.success)
        {
            return res.status(404).json({message:employee.message});
        }

        return res.status(200).json(employee);
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}