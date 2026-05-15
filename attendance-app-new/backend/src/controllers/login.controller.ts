import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { loginService } from "../services/login.service";
import { generateToken } from "../utils/jwt";

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and passwod Requires" })
        }

        const employee = await loginService(email);

        if (!employee) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" })
        }

        const token = generateToken({ id: employee.id, role: employee.role })

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login Successful", token,
            user: {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            }
        })
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Internal Server Error" });
    }
}