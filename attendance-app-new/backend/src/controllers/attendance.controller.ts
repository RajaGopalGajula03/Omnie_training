import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {getAttendanceService,checkInService,checkOutService,adminUpdateAttendanceService,} from "../services/attendance.service";

const ADMIN_ROLES = ["Manager", "HR"];

export const getAttendance = async (req: AuthRequest,res: Response) => {

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

    const isAdmin = ADMIN_ROLES.includes(req.user!.role);

    if (!isAdmin && req.user!.id !== userId) {
      return res.status(403).json({
        message: "You can only view your own attendance",
      });
    }

    const result = await getAttendanceService(userId, month);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const attendanceAction = async (req: AuthRequest,res: Response) => {

  try {
    const body = req.body;

    if (body.action === "check-in") {
      const result = await checkInService(req.user!.id);

      return res.status(result.success ? 200 : 400).json({
        message: result.message,
      });
    }

    if (body.action === "check-out") {
      const result = await checkOutService(req.user!.id);

      return res.status(result.success ? 200 : 400).json({
        message: result.message,
      });
    }

    if (body.action === "admin-update") {
      const isAdmin = ADMIN_ROLES.includes(req.user!.role);

      if (!isAdmin) {
        return res.status(403).json({
          message: "Only admin can edit attendance",
        });
      }

      const result = await adminUpdateAttendanceService(body,req.user!.id);

      return res.status(result.success ? 200 : 400).json({
        message: result.message,
      });
    }

    return res.status(400).json({
      message: "Invalid action",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};