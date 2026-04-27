

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
  status: "present" | "absent" | "holiday" | "leave";
};


export const employees : Employee[]= [
    { id: 1, name: "John Doe", email: "john@mail.com", password: 'john123', role: "Trainee" },
    { id: 2, name: "Jane Smith", email: "jane@mail.com", password: 'jane123', role: "Jr Developer" },
    { id: 3, name: "Ravi Kumar", email: "ravi@mail.com", password: 'ravi123', role: "HR" },
    { id: 4, name: "Anita Sharma", email: "anita@mail.com", password: 'anita123', role: "Senior Developer" },
    { id: 5, name: "John Snow", email: "manager@mail.com", password: 'admin123', role: "Manager" },
];

export const attendanceOverrides: AttendanceRecord[] = [];

export function addEmployee(emp: Omit<Employee, "id">) {
  const newEmployee: Employee = {
    id: employees.length + 1,
    ...emp,
  };

  employees.push(newEmployee);
  return newEmployee;
}


export function generateAttendance(userId: number) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const attendance: AttendanceRecord[] = [];

    const current = new Date(year, month, 1);

    while (current <= today) {

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
                        checkIn: randomTime("08:00", startCheckIn, userId, current.getDate()),
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

export function getAttendanceRecords(userId: number) {
    const baseRecords = generateAttendance(userId);

    return baseRecords.map((record) => {
        const override = attendanceOverrides.find(
            (item) => item.userId === userId && item.date === record.date
        );

        return override ? {...record,...override,}: record;
    });
}

export function upsertAttendanceRecord(record: AttendanceRecord) {
    const index = attendanceOverrides.findIndex(
        (item) => item.userId === record.userId && item.date === record.date
    );

    if (index === -1) {
        attendanceOverrides.push(record);
        return record;
    }

    attendanceOverrides[index] = {
        ...attendanceOverrides[index],
        ...record,
    };

    return attendanceOverrides[index];
}

export function getCurrentDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;
}

export function getCurrentTimeKey() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function checkInEmployee(userId: number) {
    const date = getCurrentDateKey();
    const existing = getAttendanceRecords(userId).find((item) => item.date === date);

    return upsertAttendanceRecord({
        userId,
        date,
        checkIn: existing?.checkIn || getCurrentTimeKey(),
        checkOut: existing?.checkOut || null,
        status: "present",
    });
}

export function checkOutEmployee(userId: number) {
    const date = getCurrentDateKey();
    const existing = getAttendanceRecords(userId).find((item) => item.date === date);

    return upsertAttendanceRecord({
        userId,
        date,
        checkIn: existing?.checkIn || getCurrentTimeKey(),
        checkOut: getCurrentTimeKey(),
        status: "present",
    });
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
