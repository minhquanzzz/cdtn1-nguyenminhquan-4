
const express = require("express");
const service = require("../services/ticket.service");

const router = express.Router();

function handleError(res, error) {
  if (error.code === "23505") {
    return res.status(409).json({ message: "Mã phiếu đã tồn tại." });
  }

  if (error.code === "23503") {
    return res.status(409).json({
      message: "Dữ liệu liên quan không tồn tại hoặc phiếu đang được tham chiếu."
    });
  }

  if (error.code === "23514") {
    return res.status(400).json({
      message: "Dữ liệu vi phạm ràng buộc của database."
    });
  }

  return res.status(error.status || 500).json({
    message: error.status ? error.message : "Lỗi máy chủ."
  });
}

router.get("/", async (req, res) => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID không hợp lệ." });
    }

    res.json(await service.getById(id));
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const ticket = await service.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID không hợp lệ." });
    }

    res.json(await service.update(id, req.body));
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID không hợp lệ." });
    }

    res.json({
      message: "Xóa phiếu thành công.",
      ticket: await service.remove(id)
    });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
