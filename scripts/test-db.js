
require("dotenv").config();
const pool = require("../src/config/database");

async function main() {
  try {
    const result = await pool.query(
      "SELECT current_database() AS database, version() AS version"
    );

    console.log("Kết nối PostgreSQL thành công!");
    console.log("Database:", result.rows[0].database);
  } catch (error) {
    console.error("Không kết nối được PostgreSQL:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
