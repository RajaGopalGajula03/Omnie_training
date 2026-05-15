import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";


type AdminAttendanceUpdate = {
    userId: number;
    date: string;
    checkIn?: string | null;
    checkOut?: string | null;
    status: string;
};

export const getAttendanceService = async (userId: number, month: string) => {

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT id,employee_id AS userId,DATE_FORMAT(attendance_date,'%Y-%m-%d') AS date,
        check_in AS checkIn,check_out AS checkOut,status FROM attendance_records
        WHERE employee_id = ? AND DATE_FORMAT(attendance_date,'%Y-%m') = ? AND deleted_at IS NULL 
        ORDER BY attendance_date DESC`, [userId, month]
    )

    return rows;
}

export const checkInService = async (userId: number) => {

    const today = new Date().toISOString().slice(0, 10);

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT status, check_in as checkIn from attendance_records WHERE employee_id = ?
        AND attendance_date = ? AND deleted_at IS NULL`, [userId, today]
    );

    const todayRecord = rows[0];

    if (todayRecord?.status === "leave" || todayRecord?.status === "holiday") {
        return {
            success: false,
            message: `You cannot check in on a ${todayRecord.status} day`
        };
    }

    if (todayRecord?.checkIn) {
        return {
            success: false,
            message: "Already checked In"
        };
    }

    await db.execute<ResultSetHeader>(
        `INSERT INTO attendance_records (employee_id,attendance_date,check_in,status)
        VALUES (?,?,CURRENT_TIME(),'present')`, [userId, today]
    );

    return {
        success: true,
        message: "Checked In Successfully"
    };
}


export const checkOutService = async (userId: number) => {

    const today = new Date().toISOString().slice(0, 10);

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT status, check_in,check_out from attendance_records WHERE employee_id = ?
        AND attendance_date = ? AND deleted_at IS NULL`, [userId, today]
    );

    const todayRecord = rows[0];

    if (todayRecord?.status === "leave" || todayRecord?.status === "holiday") {
        return {
            success: false,
            message: `You cannot check in on a ${todayRecord.status} day`
        };
    }

    if (!todayRecord?.check_in) {
        return {
            success: false,
            message: "Check In First"
        };
    }

    if (todayRecord?.check_out) {
        return {
            success: false,
            message: "Already checked out"
        };
    }

    await db.execute<ResultSetHeader>(
        `UPDATE attendance_records SET check_out = CURRENT_TIME() WHERE employee_id = ?
     AND attendance_date = ? AND deleted_at IS NULL`, [userId, today]
    );

    return {
        success: true,
        message: "Checked Out Successfully"
    };
}


export const adminUpdateAttendanceService = async (body: AdminAttendanceUpdate, updatedBy: number) => {

    const userId = Number(body.userId);

    if (Number.isNaN(userId) || !body.date) {
        return {
            success: false,
            message: "Invalid attendance update",
        };
    }

    await db.execute<ResultSetHeader>(
        `INSERT INTO attendance_records (employee_id,attendance_date,check_in,check_out,status,updated_by)
    VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE check_in = VALUES(check_in),
    check_out = VALUES(check_out), status = VALUES(status), updated_by = VALUES(updated_by)`,
        [userId, body.date, body.checkIn || null, body.checkOut || null, body.status, updatedBy,]
    );

    return {
        success: true,
        message: "Attendance updated successfully",
    };
};