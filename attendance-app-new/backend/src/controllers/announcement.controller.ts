import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createAnnouncementService, getAnnouncementsService } from "../services/announcement.service";

const ADMIN_ROLES = ["HR","Manager"];

export const getAnnouncements = async(req:AuthRequest,res:Response) =>{

    try{
        if(!req.user)
        {
            return res.status(401).json({message:"Unauthorized"});
        }

        const isAdmin = ADMIN_ROLES.includes(req.user.role);

        const announcements = await getAnnouncementsService(isAdmin);

        return res.status(200).json(announcements)
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export const createAnnouncement = async(req:AuthRequest,res:Response) =>{

    try{

        const body = req.body;

        if(!body.title || !body.description || !body.audience || !body.publish_date){
            return res.status(400).json({message:"Missing Required fields"})
        }

        if(!req.user)
        {
            return res.status(401).json({message:"Unauthorized"});
        }


        const announcement = await createAnnouncementService(body,req.user.id);

        return res.status(200).json(announcement)
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

