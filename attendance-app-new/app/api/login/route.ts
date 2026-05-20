import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
// import { employees } from "@/lib/data";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { db } from "../../../lib/db";


export async function POST(req: Request) {

    try {
        const { email, password } = await req.json();

        if(!email || !password)
        {
            return NextResponse.json({message:"Missing fields"},{status:400})
        }

        const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM employees where email = ? AND deleted_at IS NULL", [email]
        );

        // const user = employees.find(e=>e.email === email && e.password === password);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 })
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 })
        }


        const token = signToken({
            id: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
        });

        const res = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
        res.cookies.set("token", token, {
            httpOnly: true,
            path: '/',
            sameSite: "lax",
        })
        return res;
    }
    catch (error) {
        console.error("Login error : ", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
