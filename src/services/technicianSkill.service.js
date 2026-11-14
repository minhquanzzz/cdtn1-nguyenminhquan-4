
const repository = require("../repositories/technicianSkill.repository");
const technicianRepository = require("../repositories/technician.repository");

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Kiểm tra ID.
function validateId(value, fieldName) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createError(`${fieldName} không hợp lệ.`);
  }

  return id;
}

// Kiểm tra proficiency từ 1 đến 5.
function validateProficiency(value) {
  const proficiency = Number(value);

  if (
    !Number.isInteger(proficiency) ||
    proficiency < 1 ||
    proficiency > 5
  ) {
    throw createError(
      "proficiency phải là số nguyên từ 1 đến 5."
    );
  }

  return proficiency;
}

// Kiểm tra kỹ thuật viên có tồn tại.
async function checkTechnician(technicianId) {
  const technician = await technicianRepository.findById(
    technicianId
  );

  if (!technician) {
    throw createError("Không tìm thấy kỹ thuật viên.", 404);
  }

  return technician;
}

// Lấy danh sách tay nghề.
async function getAll(technicianId) {
  const id = validateId(technicianId, "technician_id");

  await checkTechnician(id);

  return repository.findAllByTechnicianId(id);
}

// Lấy chi tiết một tay nghề.
async function getById(technicianId, categoryId) {
  const technician = validateId(
    technicianId,
    "technician_id"
  );

  const category = validateId(
    categoryId,
    "category_id"
  );

  await checkTechnician(technician);

  const skill = await repository.findById(
    technician,
    category
  );

  if (!skill) {
    throw createError("Không tìm thấy tay nghề.", 404);
  }

  return skill;
}

// Thêm tay nghề.
async function create(technicianId, data) {
  const id = validateId(technicianId, "technician_id");

  await checkTechnician(id);

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Dữ liệu tay nghề không hợp lệ.");
  }

  const categoryId = validateId(
    data.category_id,
    "category_id"
  );

  const proficiency = validateProficiency(data.proficiency);

  return repository.create({
    technician_id: id,
    category_id: categoryId,
    proficiency,
  });
}

// Cập nhật tay nghề.
async function update(technicianId, categoryId, data) {
  const technician = validateId(
    technicianId,
    "technician_id"
  );

  const category = validateId(
    categoryId,
    "category_id"
  );

  await checkTechnician(technician);

  const existing = await repository.findById(
    technician,
    category
  );

  if (!existing) {
    throw createError("Không tìm thấy tay nghề.", 404);
  }

  if (!data || data.proficiency === undefined) {
    throw createError("Vui lòng nhập proficiency.");
  }

  const proficiency = validateProficiency(data.proficiency);

  return repository.update(
    technician,
    category,
    proficiency
  );
}

// Xóa tay nghề.
async function remove(technicianId, categoryId) {
  const technician = validateId(
    technicianId,
    "technician_id"
  );

  const category = validateId(
    categoryId,
    "category_id"
  );

  await checkTechnician(technician);

  const skill = await repository.remove(
    technician,
    category
  );

  if (!skill) {
    throw createError("Không tìm thấy tay nghề.", 404);
  }

  return skill;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
