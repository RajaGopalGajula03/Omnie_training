import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { employees } from "@/lib/data";


export async function POST(req:Request){

    const {email,password} = await req.json();

    const user = employees.find(e=>e.email === email && e.password === password);

    if(user)
    {
        const token = signToken({id:user.id,role:user.role});

        const res = NextResponse.json({success:true,role:user.role});
        res.cookies.set("token",token,{
            httpOnly:true,
            path:'/',
            sameSite:"lax",
        })
        return res;
    }
    return NextResponse.json({message:"Invalid Credentials"},{status:401})
}