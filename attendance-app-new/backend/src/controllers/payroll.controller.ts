import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createPayrollService, getPayrollService, updatePayrollService } from "../services/payroll.service";

export const getPayrolls = async (req: AuthRequest, res: Response) => {

    try {

        const isAdmin = req.user!.role === "Manager" || req.user!.role === "HR";

        const result = await getPayrollService(isAdmin ? undefined : req.user!.id);

        return res.status(200).json(result);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


export const createPayroll = async (req: AuthRequest, res: Response) => {

    try {

        if (!req.body.employeeId || !req.body.month || !req.body.status || !req.body.amount) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }
        const result = await createPayrollService(req.body, req.user!.id);

        return res.status(201).json(result);
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updatePayroll = async (req: AuthRequest, res: Response) => {

    try {
        const payrollId = Number(req.params.id);

        if (Number.isNaN(payrollId)) {
            return res.status(400).json({ message: "Invalid Payroll Id" });
        }

        if (!req.body.employeeId || !req.body.month || !req.body.status || !req.body.amount) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        const result = await updatePayrollService(payrollId, req.body, req.user!.id);

        if (!result) {
            return res.status(404).json({ message: "Payroll item not found" });
        }

        return res.status(200).json({
            id: result.id,
            employeeId: result.employee_id,
            month: result.payroll_month,
            status: result.status,
            amount: result.amount,
            processedDate: result.processed_date,
            remarks: result.remarks,
        });

    }
    catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Internal Server Error" });
    }
}