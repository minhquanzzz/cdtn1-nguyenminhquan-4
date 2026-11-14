
const express = require("express");
const service = require("../services/appointment.service");

const router = express.Router();

function handleError(res, error) {
  if (error.code === "23503") {
    return res.status(400).json({
      message: "Ticket hoặc kỹ thuật viên không tồn tại."
    });
  }

  if (error.code === "23514") {
    return res.status(400).json({
      message: "Thời gian lịch hẹn không hợp lệ."
    });
  }

  if (error.code === "23P01") {
    return res.status(409).json({
      message: "Lịch hẹn bị trùng thời gian."
    });
  }

  return res.status(error.status || 500).json({
    message: error.status
      ? error.message
      : "Lỗi máy chủ."
  });
}

// GET /api/v1/appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await service.getAll();
    res.json(appointments);
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/v1/appointments/:id
router.get("/:id", async (req, res) => {
  try {
    const appointment = await service.getById(req.params.id);
    res.json(appointment);
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/v1/appointments
router.post("/", async (req, res) => {
  try {
    const appointment = await service.create(req.body);

    res.status(201).json({
      message: "Tạo lịch hẹn thành công.",
      appointment
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/v1/appointments/:id
router.put("/:id", async (req, res) => {
  try {
    const appointment = await service.update(
      req.params.id,
      req.body
    );

    res.json({
      message: "Cập nhật lịch hẹn thành công.",
      appointment
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PATCH /api/v1/appointments/:id/cancel
router.patch("/:id/cancel", async (req, res) => {
  try {
    const appointment = await service.cancel(req.params.id);

    res.json({
      message: "Hủy lịch hẹn thành công.",
      appointment
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/v1/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await service.remove(req.params.id);

    if (!appointment) {
      return res.status(409).json({
        message: "Không thể xóa lịch hẹn."
      });
    }

    res.json({
      message: "Xóa lịch hẹn thành công.",
      appointment
    });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
