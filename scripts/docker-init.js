
require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const pool = require("../src/config/database");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

async function main() {
  const client = await pool.connect();

  try {
    console.log("====================================");
    console.log(" CDTN1 - LUONG 4 DATABASE INIT");
    console.log("====================================");

    await client.query("BEGIN");

    // 1. Kiểm tra các bảng nghiệp vụ
    const result = await client.query(`
      SELECT COUNT(*) AS total
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN (
          'technician',
          'ticket',
          'technician_skill',
          'appointment',
          'ticket_status_log'
        )
    `);

    const existingTables = Number(result.rows[0].total);

    if (existingTables === 0) {
      console.log("Database mới. Bắt đầu Migration...");

      const migrationPath = path.join(
        __dirname,
        "../src/migrations/001_create_tables.sql"
      );

      const migrationSQL = fs.readFileSync(migrationPath, "utf8");

      await client.query(migrationSQL);

      console.log("Migration thành công.");

      // 2. Nạp dữ liệu mẫu
      console.log("Bắt đầu Seed dữ liệu...");

      const seedPath = path.join(
        __dirname,
        "../src/seed/seed.sql"
      );

      const seedSQL = fs.readFileSync(seedPath, "utf8");

      await client.query(seedSQL);

      console.log("Seed thành công.");
    } else if (existingTables === 5) {
      console.log("Database đã có đầy đủ bảng nghiệp vụ.");
      console.log("Bỏ qua Migration và Seed.");
    } else {
      throw new Error(
        "Database có cấu trúc chưa hoàn chỉnh. Dừng khởi tạo để bảo vệ dữ liệu."
      );
    }

    // 3. Tạo bảng tài khoản nếu chưa tồn tại
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_user (
        user_id BIGSERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Tạo tài khoản Admin nếu chưa tồn tại
    const existingAdmin = await client.query(
      "SELECT user_id FROM app_user WHERE username = $1",
      [ADMIN_USERNAME]
    );

    if (existingAdmin.rowCount === 0) {
      const salt = crypto.randomBytes(16).toString("hex");

      const passwordHash = crypto
        .scryptSync(ADMIN_PASSWORD, salt, 64)
        .toString("hex");

      await client.query(
        `INSERT INTO app_user
          (username, password_hash, password_salt, role, is_active)
         VALUES ($1, $2, $3, 'ADMIN', TRUE)
         ON CONFLICT (username) DO NOTHING`,
        [ADMIN_USERNAME, passwordHash, salt]
      );

      console.log("Đã tạo tài khoản Admin.");
    } else {
      console.log("Tài khoản Admin đã tồn tại. Không tạo trùng.");
    }

    // 5. Hoàn tất transaction
    await client.query("COMMIT");

    console.log("====================================");
    console.log(" DATABASE INIT COMPLETED");
    console.log("====================================");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Database initialization thất bại:");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(async (error) => {
  console.error("Lỗi khởi tạo:", error.message);
  await pool.end();
  process.exitCode = 1;
});
