import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";

async function migrate() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "ems_db",
  });

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id, password_hash FROM employees"
  );

  for (const user of rows) {
    const value = user.password_hash;

    if (value.startsWith("$2b$") || value.startsWith("$2a$")) continue;

    const hashed = await bcrypt.hash(value, 10);

    await db.execute(
      "UPDATE employees SET password_hash = ? WHERE id = ?",
      [hashed, user.id]
    );

    console.log(`Migrated ${user.id}`);
  }

  console.log("Done");
  process.exit(0);
}

migrate();