import { leaveRequests } from "@/lib/dashboard-data";

export async function GET(req:Request){
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
        return Response.json(leaveRequests);
    }

    return Response.json(
        leaveRequests.filter((item) => item.employeeId === Number(employeeId))
    );
}
