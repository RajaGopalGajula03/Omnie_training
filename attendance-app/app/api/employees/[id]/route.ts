import { employees } from "@/lib/data";
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: any) {
    const { id } = await params;

    const emp = employees.find((emp) => emp.id === Number(id));

    console.log("emp from id route:", emp)

    if (!emp) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...emp,
        projects: ["Project A", "Project B"],
    });
}