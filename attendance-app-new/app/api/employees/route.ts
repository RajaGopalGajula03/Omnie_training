import { employees, addEmployee } from "@/lib/data";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest){
    const token = req.cookies.get("token")?.value;

    if(!token || !verifyToken(token)){
        return NextResponse.json({message:"Unauthorized"},{status:401});
    }
    return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const newEmployee = addEmployee(body);

  return NextResponse.json(newEmployee);
}