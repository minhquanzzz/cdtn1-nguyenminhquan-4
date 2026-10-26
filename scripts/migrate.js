
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../src/config/database");

async function main() {
  const filePath = path.join(
    __dirname,
    "../src/migrations/001_create_tables.sql"
  );

  const sql = fs.readFileSync(filePath, "utf8");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");

    console.log("Migration thành công: đã tạo các bảng BT1.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration thất bại:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exitCode = 1;
});
