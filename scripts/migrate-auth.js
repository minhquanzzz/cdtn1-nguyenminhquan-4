require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../src/config/database");

async function main() {
    const filePath = path.join(
        __dirname,
        "../src/migrations/002_create_users.sql"
    );

    const sql = fs.readFileSync(filePath, "utf8");

    try {
        await pool.query(sql);
        console.log("Migration thành công: đã tạo bảng app_user.");
    } catch (error) {
        console.error("Migration thất bại:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();