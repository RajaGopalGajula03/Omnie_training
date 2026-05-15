import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import bcrypt from "bcrypt";
import { generateEmployeeCode } from "../utils/employeeCode";
import mysql from "mysql2";

interface CreateEmployeeData {
    name: string;
    email: string;
    password: string;
    role: string;
    department_id: number;
}
interface UpdateEmployeeData {
    name: string;
    email: string;
    role: string;
    department_id: number;
}

export const getEmployeesService = async () => {
    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT id,name,email,role,deleted_at FROM employees WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );

    if (rows.length === 0) {
        return null;
    }

    return rows;
}


export const createEmployeeService = async (data: CreateEmployeeData, userId: number) => {
    try {
        const { name, email, password, role, department_id } = data;

        const [rows] = await db.execute<RowDataPacket[]>(
            `SELECT employee_code FROM employees ORDER BY id DESC LIMIT 1`
        );

        const lastCode = rows.length ? rows[0].employee_code : null;

        const employeeCode = generateEmployeeCode(lastCode);

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute<ResultSetHeader>(
            `INSERT INTO employees (name,email,password_hash,employee_code,role,department_id,created_by,
        updated_by) VALUES (?,?,?,?,?,?,?,?)`, [name, email, hashedPassword, employeeCode, role, department_id, userId, userId]
        );
        // INSERT INTO employees (name,email,password_hash,employee_code,role,department_id,created_by,updated_by)
        return {
            success: true,
            data: {
                id: result.insertId, name, email, role, department_id, employeeCode
            }
        }
    }
    catch (error: unknown) {

        const mysqlError = error as mysql.QueryError;

        if (mysqlError.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                message: "Email Already Exists"
            };
        }
        throw error;
    }
}

export const getSingleEmployeeService = async (employeeId: number) => {

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT * FROM employees WHERE id = ? AND deleted_at IS NULL`, [employeeId]
    )

    return rows[0];
}

export const updateEmployeeService = async (employeeId: number, data: UpdateEmployeeData, userId: number) => {

    try {
        const { name, email, role, department_id } = data;

        const [result] = await db.execute<ResultSetHeader>(
            `UPDATE employees SET name = ?,email = ?, role = ?,department_id = ?,updated_by = ?,
        updated_at = NOW() WHERE id = ? AND deleted_at IS NULL`, [name, email, role, department_id, userId, employeeId]
        )
        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Employee not found"
            };
        }

        return {
            success: true,
            data: {
                id: employeeId,
                name,
                email,
                role,
                department_id
            }
        };
    }
    catch (error) {
        const mysqlError = error as mysql.QueryError;

        if (mysqlError.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                message: "Email Already Exists"
            };
        }
        throw error;
    }
}

export const deleteEmployeeService = async (employeeId: number, userId: number) => {

    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE employees SET is_active = ?,deleted_at = NOW(),deleted_by = ?,updated_at = NOW(),
        updated_by = ? WHERE id = ? AND deleted_at IS NULL`, [false, userId, userId, employeeId]
    );
    if (result.affectedRows === 0) {
        return null;
    }

    return { message: "Employee Deleted Successfully" };
};


export const restoreEmployeeService = async (employeeId: number, userId: number) => {

    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE employees SET is_active = TRUE,deleted_at = NULL, updated_by = ?,updated_at = NOW()
        WHERE id = ?`, [userId, employeeId]
    );

    if (result.affectedRows === 0) {
        return {
            success: false,
            message: "Employee Not Found"
        }
    }

    return {
        success: true,
        message: "Employee Restored Successfully",
    };
}