import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";


interface CreateAnnouncementData {
    title: string;
    description: string;
    audience: string;
    publish_date: string;
    is_active: boolean;
}

export const getAnnouncementsService = async (isAdmin: boolean) => {

    let query = `SELECT id,title,description,audience,publish_date,is_active FROM announcements
    WHERE deleted_at IS NULL AND is_active = TRUE `;

    if (!isAdmin) {
        query += ` AND (audience = 'all' OR audience = "employee") `;
    }

    query += ` ORDER BY publish_date DESC`;

    const [rows] = await db.execute<RowDataPacket[]>(query);

    return rows;
}

export const createAnnouncementService = async (data: CreateAnnouncementData, userId: number) => {

    const { title, description, audience, publish_date, is_active } = data;

    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO announcements (title,description,audience,publish_date,is_active,created_by)
        VALUES (?,?,?,?,?,?)`, [title, description, audience, publish_date, is_active, userId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return { message: "Announcement Created Successfully", id: result.insertId };
}

export const updateAnnouncementService = async (announcementId: number, data: CreateAnnouncementData, userId: number) => {

    const { title, description, audience, publish_date, is_active, } = data;

    const [result] = await db.execute<ResultSetHeader>(
        `UPDATE announcements SET title = ?, description = ?, audience = ?, publish_date = ?,is_active = ?,
        updated_by = ? WHERE id = ? AND deleted_at IS NULL`, [title, description, audience, publish_date, is_active, userId, announcementId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT
        id,
        title,
        description,
        audience,
        publish_date AS publishDate,
        is_active AS isActive,
        updated_by AS updatedBy
     FROM announcements
     WHERE id = ?`,
        [announcementId]
    );

    return {
        message:"Announcement updated successfully",
        data:rows[0],
    };
}