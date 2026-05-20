import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";

type CreatePayrollBody = {
    employeeId: number,
    month: string,
    status: string,
    amount: number,
}

type UpdatePayrollBody = {
    employeeId: number,
    month: string,
    status: string,
    amount: number,
    processedDate?: string | null,
    remarks?: string | null,
}

export const getPayrollService = async (userId?: number) => {

    if (userId) {
        const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT id, employee_id AS employeeId, payroll_month AS month, status, amount, 
        processed_date AS processedDate, remarks FROM payrolls WHERE employee_id = ?
        ORDER BY id DESC`,[userId]
        );

        return rows;
    }

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT id, employee_id AS employeeId, payroll_month AS month, status, amount,
        processed_date AS processedDate, remarks FROM payrolls ORDER BY id DESC `
        );
        
    return rows;
};

export const createPayrollService = async (body: CreatePayrollBody, userId: number) => {

    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO payrolls (employee_id,payroll_month,status,amount,created_by,created_at)
        VALUES (?,?,?,?,?,NOW())`, [Number(body.employeeId), body.month, body.status, Number(body.amount), userId]
    );

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT * FROM payrolls WHERE id = ?`, [result.insertId]
    );

    return rows[0];
};

export const updatePayrollService = async (payrollId: number, body: UpdatePayrollBody, userId: number) => {

    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE payrolls SET employee_id = ?,payroll_month = ?, status = ?,amount = ?, processed_date = ?, remarks = ?,
        updated_by = ?,updated_at = NOW() WHERE id = ?`, [Number(body.employeeId), body.month, body.status, Number(body.amount),
    body.processedDate ?? null, body.remarks ?? null, userId, payrollId,
    ]
    );

    if (result.affectedRows === 0) {
        return null;
    }
    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT * FROM payrolls WHERE id = ?`, [payrollId]
    );

    return rows[0];
}

