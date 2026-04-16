import { NextRequest,NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";


export async function GET(req:NextRequest){
    const token = req.cookies.get("token")?.value;

    if(!token)
    {
        return NextResponse.json({message:"No token"},{status:401})
    }
    
    const user = verifyToken(token);

    if(!user)
    {
        return NextResponse.json({message:'Invalid token'},{status:403});
    }
    return NextResponse.json({
        message:'Protected Data',
        user,
    })
}