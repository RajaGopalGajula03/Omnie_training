import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createAnnouncementService, getAnnouncementsService, updateAnnouncementService } from "../services/announcement.service";


export const getAnnouncements = async (req: AuthRequest, res: Response) => {

    try {


        const isAdmin = req.user!.role === "HR" || req.user!.role === "Manager";

        const announcements = await getAnnouncementsService(isAdmin);

        return res.status(200).json(announcements)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const createAnnouncement = async (req: AuthRequest, res: Response) => {

    try {

        const body = req.body;

        if (!body.title || !body.description || !body.audience || !body.publish_date) {
            return res.status(400).json({ message: "Missing Required fields" })
        }

        const isValidDate =/^\d{4}-\d{2}-\d{2}$/.test(body.publish_date);

        if (!isValidDate) {
            return res.status(400).json({
                message:
                    "Date must be YYYY-MM-DD"
            });
        }


        const announcement = await createAnnouncementService(body, req.user!.id);

        return res.status(200).json(announcement)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {

    try {

        const body = req.body;

        if (!body.title || !body.description || !body.audience || !body.publish_date) {
            return res.status(400).json({ message: "Missing Required fields" })
        }

        const announcementId = Number(req.params.id);

        if (Number.isNaN(announcementId)) {
            return res.status(400).json({
                message: "Invalid Announcement Id",
            });
        }

        const announcement = await updateAnnouncementService(announcementId, body, req.user!.id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement Not Found" });
        }

        return res.status(200).json(announcement)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
