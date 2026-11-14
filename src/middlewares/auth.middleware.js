const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        // Lấy token từ Header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Vui lòng đăng nhập để tiếp tục."
            });
        }

        const token = authHeader.split(" ")[1];

        // Xác thực token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Chỉ cho phép tài khoản Admin
        if (decoded.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền truy cập."
            });
        }

        // Lưu thông tin người dùng vào request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn."
        });
    }
}

module.exports = authMiddleware;