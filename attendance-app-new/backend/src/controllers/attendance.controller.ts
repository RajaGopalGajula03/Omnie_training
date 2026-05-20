import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getAttendanceService, checkInService, checkOutService, adminUpdateAttendanceService, } from "../services/attendance.service";



export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const month = req.query.month as string;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const result = await getAttendanceService(req.user!.id, month);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAttendance = async (req: AuthRequest, res: Response) => {

  try {
    const userIdParam = req.query.userId as string;
    const month = req.query.month as string;

    if (!userIdParam || !month) {
      return res.status(400).json({
        message: "Missing params",
      });
    }

    const userId = Number(userIdParam);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const isAdmin = req.user!.role === "Manager" || req.user!.role === "HR";

    if (!isAdmin && req.user!.id !== userId) {
      return res.status(403).json({
        message: "You can only view your own attendance",
      });
    }

    const result = await getAttendanceService(userId, month);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error", });
  }
};

export const checkIn = async (req: AuthRequest, res: Response) => {

  try {

    const result = await checkInService(req.user!.id);

    return res.status(result.success ? 200 : 400).json({ message: result.message, });

  } catch (error) {

    console.error(error);

    return res.status(500).json({ message: "Internal Server Error", });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {

  try {

    const result = await checkOutService(req.user!.id);

    return res.status(result.success ? 200 : 400).json({ message: result.message, });

  } catch (error) {

    console.error(error);

    return res.status(500).json({ message: "Internal Server Error", });
  }
};

export const adminUpdateAttendance = async (req: AuthRequest, res: Response) => {

  try {

    const result = await adminUpdateAttendanceService(req.body, req.user!.id);

    return res.status(result.success ? 200 : 400).json({ message: result.message, });

  } catch (error) {

    console.error(error);

    return res.status(500).json({ message: "Internal Server Error", });
  }
};