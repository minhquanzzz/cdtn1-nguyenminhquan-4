
require("dotenv").config();

const express = require("express");
const pool = require("./config/database");
const ticketRoutes = require("./routes/ticket.routes");

const app = express();
const port = Number(process.env.PORT || 3000);

// Middleware
app.use(express.json());

// Endpoint trang gốc
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend Luong 4 dang hoat dong",
    project: "CDTN1 - Phan cong ky thuat vien va lich hen",
    endpoints: {
      home: "/",
      health: "/health",
      tickets: "/api/v1/tickets"
    }
  });
});

// Endpoint kiểm tra kết nối PostgreSQL
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    console.error("Loi ket noi PostgreSQL:", error.message);

    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

// API quản lý phiếu sửa chữa
app.use("/api/v1/tickets", ticketRoutes);

// Xử lý JSON không hợp lệ
app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      message: "Dữ liệu JSON không hợp lệ."
    });
  }

  next(error);
});

// Xử lý endpoint không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: "Không tìm thấy endpoint."
  });
});

// Xử lý lỗi ngoài dự kiến
app.use((error, req, res, next) => {
  console.error("Loi server:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message: "Đã xảy ra lỗi nội bộ máy chủ."
  });
});

// Khởi động server khi chạy trực tiếp app.js
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server dang chay tai http://localhost:${port}`);
  });
}

module.exports = app;
