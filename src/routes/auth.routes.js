const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const pool = require("../config/database");

const router = express.Router();

// API đăng nhập Admin
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập tên đăng nhập và mật khẩu."
            });
        }

        // Tìm tài khoản trong database
        const result = await pool.query(
            `SELECT user_id, username, password_hash,
                    password_salt, role, is_active
             FROM app_user
             WHERE username = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Tên đăng nhập hoặc mật khẩu không đúng."
            });
        }

        const user = result.rows[0];

        // Kiểm tra tài khoản có đang hoạt động không
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: "Tài khoản đã bị khóa."
            });
        }

        // Kiểm tra mật khẩu bằng scrypt
        const inputHash = crypto.scryptSync(
            password,
            user.password_salt,
            64
        );

        const storedHash = Buffer.from(
            user.password_hash,
            "hex"
        );

        const passwordValid =
            inputHash.length === storedHash.length &&
            crypto.timingSafeEqual(inputHash, storedHash);

        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Tên đăng nhập hoặc mật khẩu không đúng."
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                userId: user.user_id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi đăng nhập."
        });
    }
});

module.exports = router;