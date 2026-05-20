import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";


type User = {
    id: number;
    role: string;
};

type CreateLeaveBody = {
    employeeId?: number;
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
}

type UpdateLeaveBody = {
    leaveType?: string;
    fromDate?: string;
    toDate?: string;
    reason?: string;
    status?: string;
    adminRemark?: string;
}

export const getLeaveRequestService = async (employeeId?: number) => {

    let query = `
    SELECT id, employee_id AS employeeId, leave_type AS leaveType, from_date AS fromDate,
    to_date AS toDate, total_days AS days, reason, status, admin_remark AS adminRemark
    FROM leave_requests WHERE deleted_at IS NULL
  `;

    const values: number[] = [];

    if (employeeId !== undefined) {

        query += ` AND employee_id = ?`;

        values.push(employeeId);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] =
        await db.execute<RowDataPacket[]>(
            query,
            values
        );

    return rows;
};
export const createLeaveRequestService = async (user: User, body: CreateLeaveBody) => {

    const isAdmin = user.role === "Manager" || user.role === "HR";

    const employeeId = isAdmin ? Number(body.employeeId) : user.id;

    const totalDays = Math.ceil((new Date(body.toDate).getTime() - new Date(body.fromDate).getTime()) / (1000 * 60 * 60 * 24) + 1);

    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO leave_requests (employee_id,leave_type,from_date,to_date,total_days,reason,status,created_by)
        VALUES (?,?,?,?,?,?,?,?)`, [employeeId, body.leaveType, body.fromDate, body.toDate, totalDays, body.reason, "pending", user.id]
    )
    return result;
}

export const updateLeaveRequestService = async (leaveId: number, body: UpdateLeaveBody, updatedBy: number) => {


    const isStatusOnlyUpdate = body.status !== undefined && body.leaveType === undefined;

    if (isStatusOnlyUpdate) {

        const [result] = await db.execute<ResultSetHeader>(
            `UPDATE leave_requests SET status = ?,approved_by = ?,approved_at = NOW(),updated_by = ?
            WHERE id = ? AND deleted_at IS NULL`, [body.status!, updatedBy, updatedBy, leaveId]
        )

        if (result.affectedRows === 0) {
            return {
                statusCode: 404,
                data: {
                    message: "Leave Request Not Found"
                }
            };
        }

        const [rows] = await db.execute<RowDataPacket[]>(
            `SELECT * FROM leave_requests WHERE id = ?`, [leaveId]
        );

        return {
            statusCode: 200,
            data: rows[0]
        };
    }

    if (!body.leaveType || !body.fromDate || !body.toDate || !body.reason) {
        return {
            statusCode: 400,
            data: {
                message: "Missing Required Fields"
            }
        }
    }

    const from = new Date(body.fromDate);

    const to = new Date(body.toDate);

    if (from > to) {
        return {
            statusCode: 400,
            data: {
                message: "From date cannot be greater than to date",
            },
        };
    }

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        return {
            statusCode: 400,
            data: { message: "Invalid Date format" }
        }
    }

    const totalDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1);

    const approvedBy = body.status === "approved" ? updatedBy : null;

    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE leave_requests SET leave_type = ?,from_date = ?,to_date = ?, total_days = ?,
        reason = ?,status = ?,approved_by = ?,approved_at = NOW(),admin_remark = ?, updated_by = ?
        WHERE id = ? AND deleted_at IS NULL`, [body.leaveType, body.fromDate, body.toDate, totalDays,
    body.reason, body.status!, approvedBy, body.adminRemark ?? null, updatedBy, leaveId
    ]
    );

    if (result.affectedRows === 0) {
        return {
            statusCode: 404,
            data: { message: "Leave Request Not found" }
        }
    };

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT * FROM leave_requests WHERE id = ?`, [leaveId]
    );

    return {
        statusCode: 200,
        message:"leave request updated successfully",
        data: rows[0]
    }
};

