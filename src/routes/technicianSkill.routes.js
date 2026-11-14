
const express = require("express");
const service = require("../services/technicianSkill.service");

const router = express.Router({ mergeParams: true });

function handleError(res, error) {
  if (error.code === "23505") {
    return res.status(409).json({
      message: "Nhóm sự cố này đã được khai báo cho kỹ thuật viên.",
    });
  }

  if (error.code === "23503") {
    return res.status(400).json({
      message: "Kỹ thuật viên hoặc nhóm sự cố không hợp lệ.",
    });
  }

  return res.status(error.status || 500).json({
    message: error.status ? error.message : "Lỗi máy chủ.",
  });
}

// GET danh sách tay nghề.
router.get("/", async (req, res) => {
  try {
    const skills = await service.getAll(
      req.params.technicianId
    );

    res.json(skills);
  } catch (error) {
    handleError(res, error);
  }
});

// GET chi tiết tay nghề.
router.get("/:categoryId", async (req, res) => {
  try {
    const skill = await service.getById(
      req.params.technicianId,
      req.params.categoryId
    );

    res.json(skill);
  } catch (error) {
    handleError(res, error);
  }
});

// POST thêm tay nghề.
router.post("/", async (req, res) => {
  try {
    const skill = await service.create(
      req.params.technicianId,
      req.body
    );

    res.status(201).json({
      message: "Thêm tay nghề thành công.",
      skill,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT cập nhật tay nghề.
router.put("/:categoryId", async (req, res) => {
  try {
    const skill = await service.update(
      req.params.technicianId,
      req.params.categoryId,
      req.body
    );

    res.json({
      message: "Cập nhật tay nghề thành công.",
      skill,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE xóa tay nghề.
router.delete("/:categoryId", async (req, res) => {
  try {
    const skill = await service.remove(
      req.params.technicianId,
      req.params.categoryId
    );

    res.json({
      message: "Xóa tay nghề thành công.",
      skill,
    });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
