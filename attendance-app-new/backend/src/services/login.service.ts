import { db } from "../config/db";
import { RowDataPacket } from "mysql2";



export const loginService = async(email:string) =>{

    const[rows] = await db.execute<RowDataPacket[]>(
        `SELECT * FROM employees WHERE email = ? AND deleted_at IS NULL`,[email]
    );

    return rows[0];
}

