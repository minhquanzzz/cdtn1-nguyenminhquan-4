require("dotenv").config();

const crypto = require("crypto");
const pool = require("../src/config/database");

const username = "admin";
const password = "Admin@12345";

async function seedAdmin() {
    try {
        // Tạo salt riêng cho tài khoản
        const salt = crypto.randomBytes(16).toString("hex");

        // Băm mật khẩu
        const passwordHash = crypto
            .scryptSync(password, salt, 64)
            .toString("hex");

        // Tạo tài khoản nếu chưa tồn tại
        await pool.query(
            `INSERT INTO app_user
                (username, password_hash, password_salt, role, is_active)
             VALUES ($1, $2, $3, 'ADMIN', TRUE)
             ON CONFLICT (username) DO NOTHING`,
            [username, passwordHash, salt]
        );

        console.log("Đã kiểm tra tài khoản Admin.");
        console.log("Username: admin");
        console.log("Password: Admin@12345");
    } catch (error) {
        console.error("Không thể tạo Admin:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

seedAdmin();