
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const pool = require("./config/database");
const ticketRoutes = require("./routes/ticket.routes");

const app = express();
const port = Number(process.env.PORT || 3000);

// ==============================
// 1. Cấu hình CORS
// Cho phép frontend React/Vite gọi backend
// ==============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      // Cho phép các công cụ không gửi Origin, ví dụ curl/Postman
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin không được phép truy cập: ${origin}`)
      );
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==============================
// 2. Middleware đọc JSON
// ==============================
app.use(express.json());

// ==============================
// 3. Endpoint trang chủ
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend Luong 4 dang hoat dong",
    project: "CDTN1 - Phan cong ky thuat vien va lich hen",
    endpoints: {
      home: "/",
      health: "/health",
      tickets: "/api/v1/tickets",
    },
  });
});

// ==============================
// 4. Kiểm tra kết nối PostgreSQL
// ==============================
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    return res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Loi ket noi PostgreSQL:", error.message);

    return res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// ==============================
// 5. API quản lý ticket
// Giữ nguyên các route hiện có
// ==============================
app.use("/api/v1/tickets", ticketRoutes);

// ==============================
// 6. Xử lý JSON không hợp lệ
// ==============================
app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      message: "Dữ liệu JSON không hợp lệ.",
    });
  }

  next(error);
});

// ==============================
// 7. Xử lý endpoint không tồn tại
// ==============================
app.use((req, res) => {
  return res.status(404).json({
    message: "Không tìm thấy endpoint.",
  });
});

// ==============================
// 8. Xử lý lỗi ngoài dự kiến
// ==============================
app.use((error, req, res, next) => {
  console.error("Loi server:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: "Đã xảy ra lỗi nội bộ máy chủ.",
  });
});

// ==============================
// 9. Khởi động backend
// ==============================
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server dang chay tai http://localhost:${port}`);
  });
}

module.exports = app;
