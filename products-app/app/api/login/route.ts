import { NextRequest,NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req:NextRequest){
    const body = await req.json()
    const{username,password} = body;

    // dummy validation
    if(username === "admin" && password === "1234"){
        const token = signToken({userId:1,name:"admin"});

       const response = NextResponse.json({success:true});

       response.cookies.set('token',token,{
        httpOnly:true,
        secure:true,
        path:'/',
        maxAge:60*60*24,
       });

       return response;
    }
    return NextResponse.json(
        {message:"Invalid credentials"},
        {status:401}
    );
}
