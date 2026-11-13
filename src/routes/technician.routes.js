const express = require("express");
const service = require("../services/technician.service");

const router = express.Router();

function handleError(res, error) {
  if (error.code === "23503") {
    return res.status(409).json({
      message:
        "Không thể xóa kỹ thuật viên vì đang được dữ liệu khác tham chiếu.",
    });
  }

  if (error.code === "23505") {
    return res.status(409).json({
      message: "Dữ liệu kỹ thuật viên bị trùng.",
    });
  }

  if (error.code === "23514") {
    return res.status(400).json({
      message: "Dữ liệu vi phạm ràng buộc của database.",
    });
  }

  return res.status(error.status || 500).json({
    message: error.status ? error.message : "Lỗi máy chủ.",
  });
}

// GET /api/v1/technicians
router.get("/", async (req, res) => {
  try {
    const technicians = await service.getAll();
    res.json(technicians);
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/v1/technicians/:id
router.get("/:id", async (req, res) => {
  try {
    const technician = await service.getById(req.params.id);
    res.json(technician);
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/v1/technicians
router.post("/", async (req, res) => {
  try {
    const technician = await service.create(req.body);

    res.status(201).json({
      message: "Thêm kỹ thuật viên thành công.",
      technician,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/v1/technicians/:id
router.put("/:id", async (req, res) => {
  try {
    const technician = await service.update(
      req.params.id,
      req.body
    );

    res.json({
      message: "Cập nhật kỹ thuật viên thành công.",
      technician,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/v1/technicians/:id
router.delete("/:id", async (req, res) => {
  try {
    const technician = await service.remove(req.params.id);

    res.json({
      message: "Xóa kỹ thuật viên thành công.",
      technician,
    });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;