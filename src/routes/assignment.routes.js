
const express = require("express");
const service = require("../services/assignment.service");

const router = express.Router();

function handleError(res, error) {
  if (error.code === "23503") {
    return res.status(400).json({
      message: "Dữ liệu Ticket hoặc kỹ thuật viên không hợp lệ."
    });
  }

  if (error.code === "23514") {
    return res.status(400).json({
      message: "Dữ liệu vi phạm ràng buộc database."
    });
  }

  return res.status(error.status || 500).json({
    message: error.status
      ? error.message
      : "Lỗi máy chủ."
  });
}

// GET /api/v1/assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await service.getAll();
    res.json(assignments);
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/v1/assignments/suggest/:ticketId
router.get("/suggest/:ticketId", async (req, res) => {
  try {
    const result = await service.suggest(
      req.params.ticketId,
      req.query
    );

    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/v1/assignments
router.post("/", async (req, res) => {
  try {
    const result = await service.assign(req.body);

    res.status(201).json({
      message: "Phân công kỹ thuật viên thành công.",
      ...result
    });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
