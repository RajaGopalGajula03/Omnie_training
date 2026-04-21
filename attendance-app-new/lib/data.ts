

export type Employee = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

export type AttendanceRecord = {
  userId: number;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: "present" | "absent" | "holiday";
};


export const employees : Employee[]= [
    { id: 1, name: "John Doe", email: "john@mail.com", password: 'john123', role: "Trainee" },
    { id: 2, name: "Jane Smith", email: "jane@mail.com", password: 'jane123', role: "Jr Developer" },
    { id: 3, name: "Ravi Kumar", email: "ravi@mail.com", password: 'ravi123', role: "HR" },
    { id: 4, name: "Anita Sharma", email: "anita@mail.com", password: 'anita123', role: "Senior Developer" },
    { id: 5, name: "John Snow", email: "manager@mail.com", password: 'admin123', role: "Manager" },
];

export function addEmployee(emp: Omit<Employee, "id">) {
  const newEmployee: Employee = {
    id: employees.length + 1,
    ...emp,
  };

  employees.push(newEmployee);
  return newEmployee;
}

// export const attendance = [

//     { userId: 1, date: "2026-04-01", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 1, date: "2026-04-02", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 1, date: "2026-04-03", status: "absent" },
//     { userId: 1, date: "2026-04-04", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 1, date: "2026-04-05", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 1, date: "2026-04-06", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 1, date: "2026-04-07", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 1, date: "2026-04-08", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 1, date: "2026-04-09", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 1, date: "2026-04-10", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 1, date: "2026-04-11", status: "absent" },
//     { userId: 1, date: "2026-04-12", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 1, date: "2026-04-13", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 1, date: "2026-04-14", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 1, date: "2026-04-15", status: "absent" },
//     { userId: 1, date: "2026-04-16", checkIn: "09:20", checkOut: "17:50", status: "present" },

//     { userId: 2, date: "2026-04-01", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 2, date: "2026-04-02", status: "absent" },
//     { userId: 2, date: "2026-04-03", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 2, date: "2026-04-04", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 2, date: "2026-04-05", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 2, date: "2026-04-06", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 2, date: "2026-04-07", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 2, date: "2026-04-08", status: "absent" },
//     { userId: 2, date: "2026-04-09", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 2, date: "2026-04-10", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 2, date: "2026-04-11", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 2, date: "2026-04-12", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 2, date: "2026-04-13", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 2, date: "2026-04-14", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 2, date: "2026-04-15", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 2, date: "2026-04-16", status: "absent" },


//     { userId: 3, date: "2026-04-01", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 3, date: "2026-04-02", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 3, date: "2026-04-03", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 3, date: "2026-04-04", status: "absent" },
//     { userId: 3, date: "2026-04-05", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 3, date: "2026-04-06", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 3, date: "2026-04-07", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 3, date: "2026-04-08", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 3, date: "2026-04-09", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 3, date: "2026-04-10", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 3, date: "2026-04-11", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 3, date: "2026-04-12", status: "absent" },
//     { userId: 3, date: "2026-04-13", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 3, date: "2026-04-14", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 3, date: "2026-04-15", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 3, date: "2026-04-16", status: "absent" },

//     { userId: 4, date: "2026-04-01", status: "absent" },
//     { userId: 4, date: "2026-04-02", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 4, date: "2026-04-03", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 4, date: "2026-04-04", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 4, date: "2026-04-05", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 4, date: "2026-04-06", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 4, date: "2026-04-07", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 4, date: "2026-04-08", status: "absent" },
//     { userId: 4, date: "2026-04-09", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 4, date: "2026-04-10", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 4, date: "2026-04-11", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 4, date: "2026-04-12", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 4, date: "2026-04-13", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 4, date: "2026-04-14", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 4, date: "2026-04-15", status: "absent" },
//     { userId: 4, date: "2026-04-16", checkIn: "09:10", checkOut: "18:05", status: "present" },

//     { userId: 5, date: "2026-04-01", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 5, date: "2026-04-02", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 5, date: "2026-04-03", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 5, date: "2026-04-04", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 5, date: "2026-04-05",  status: "absent" },
//     { userId: 5, date: "2026-04-06", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 5, date: "2026-04-07", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 5, date: "2026-04-08", checkIn: "09:10", checkOut: "18:05", status: "present"},
//     { userId: 5, date: "2026-04-09", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 5, date: "2026-04-10", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 5, date: "2026-04-11", status: "absent"  },
//     { userId: 5, date: "2026-04-12", checkIn: "09:20", checkOut: "17:50", status: "present" },
//     { userId: 5, date: "2026-04-13", checkIn: "09:00", checkOut: "18:00", status: "present" },
//     { userId: 5, date: "2026-04-14", checkIn: "09:10", checkOut: "18:05", status: "present" },
//     { userId: 5, date: "2026-04-15", status: "absent" },
//     { userId: 5, date: "2026-04-16", checkIn: "09:10", checkOut: "18:05", status: "present" },
// ];

export function generateAttendance(userId: number) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const attendance: AttendanceRecord[] = [];

    const current = new Date(year, month, 1);

    while (current <= today) {

        // const day = new Date(
        //     current.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        // ).getDay();

        const day = current.getDay();
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");

        const dateStr = `${y}-${m}-${d}`;

        if (day === 0 || day === 6) {
            attendance.push({
                userId,
                date: dateStr,
                status: "holiday",
            });
        }
        else {

            const isToday =
                current.getDate() === today.getDate() &&
                current.getMonth() === today.getMonth() &&
                current.getFullYear() === today.getFullYear();


            const isPresent = getSeededRatio(userId, current) > 0.2;

            if (isPresent) {
                if (isToday) {
                    const now = new Date();
                    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
                        now.getMinutes()
                    ).padStart(2, "0")}`;

                    const startCheckIn = now.getHours() < 9 ? "09:00" : currentTime;

                    attendance.push({
                        userId,
                        date: dateStr,
                        checkIn: randomTime("08:00", startCheckIn, userId, current.getDate()), // after 9 & before now
                        checkOut: now.getHours() >= 18
                            ? randomTime("18:00", currentTime, userId + 10, current.getDate())
                            : null,
                        status: "present",
                    });
                }
                else {
                    attendance.push({
                        userId,
                        date: dateStr,
                        checkIn: randomTime("09:00", "09:30", userId, current.getDate()),
                        checkOut: randomTime("18:00", "18:30", userId + 10, current.getDate()),
                        status: "present",
                    })
                }
            }
            else {
                attendance.push({
                    userId,
                    date: dateStr,
                    status: 'absent'
                })
            }
        }
        current.setDate(current.getDate() + 1);
    }
    return attendance;
}

function randomTime(start: string, end: string, seedBase: number, daySeed: number) {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    const range = Math.max(endMinutes - startMinutes, 1);
    const offset = Math.floor(getSeededRatio(seedBase, new Date(2026, 0, daySeed)) * range);
    const randomMinutes = offset + startMinutes;

    const h = Math.floor(randomMinutes / 60).toString().padStart(2, "0");
    const m = (randomMinutes % 60).toString().padStart(2, "0");

    return `${h}:${m}`;
}

function getSeededRatio(seed: number, date: Date) {
    const value =
        Math.sin(seed * 97 + date.getDate() * 13 + (date.getMonth() + 1) * 17 + date.getFullYear()) *
        10000;
    return value - Math.floor(value);
}
