const repository = require("../repositories/technician.repository");

// Tạo lỗi nghiệp vụ có HTTP status.
function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Kiểm tra ID hợp lệ.
function validateId(id) {
  const technicianId = Number(id);

  if (!Number.isSafeInteger(technicianId) || technicianId <= 0) {
    throw createError("ID kỹ thuật viên không hợp lệ.");
  }

  return technicianId;
}

// Kiểm tra dữ liệu đầu vào.
function validateData(data, isUpdate = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Dữ liệu kỹ thuật viên không hợp lệ.");
  }

  const allowedFields = [
    "employee_id",
    "center_id",
    "level",
    "is_active",
  ];

  const unknownFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    throw createError(
      `Trường dữ liệu không được hỗ trợ: ${unknownFields.join(", ")}`
    );
  }

  const requiredFields = ["employee_id", "center_id", "level"];

  if (!isUpdate) {
    const missingFields = requiredFields.filter(
      (field) => data[field] === undefined || data[field] === null
    );

    if (missingFields.length > 0) {
      throw createError(
        `Thiếu trường bắt buộc: ${missingFields.join(", ")}`
      );
    }
  }

  const result = {};

  // Kiểm tra employee_id.
  if (data.employee_id !== undefined) {
    const employeeId = Number(data.employee_id);

    if (!Number.isSafeInteger(employeeId) || employeeId <= 0) {
      throw createError("employee_id phải là số nguyên dương.");
    }

    result.employee_id = employeeId;
  }

  // Kiểm tra center_id.
  if (data.center_id !== undefined) {
    const centerId = Number(data.center_id);

    if (!Number.isSafeInteger(centerId) || centerId <= 0) {
      throw createError("center_id phải là số nguyên dương.");
    }

    result.center_id = centerId;
  }

  // Kiểm tra level.
  if (data.level !== undefined) {
    if (
      typeof data.level !== "string" ||
      !data.level.trim() ||
      data.level.trim().length > 10
    ) {
      throw createError(
        "level phải là chuỗi không rỗng và không vượt quá 10 ký tự."
      );
    }

    result.level = data.level.trim();
  }

  // Kiểm tra is_active.
  if (data.is_active !== undefined) {
    if (typeof data.is_active !== "boolean") {
      throw createError("is_active phải có giá trị true hoặc false.");
    }

    result.is_active = data.is_active;
  }

  return result;
}

// Lấy tất cả kỹ thuật viên.
async function getAll() {
  return repository.findAll();
}

// Lấy chi tiết kỹ thuật viên.
async function getById(id) {
  const technicianId = validateId(id);
  const technician = await repository.findById(technicianId);

  if (!technician) {
    throw createError("Không tìm thấy kỹ thuật viên.", 404);
  }

  return technician;
}

// Thêm kỹ thuật viên.
async function create(data) {
  const validatedData = validateData(data);

  const technicianData = {
    employee_id: validatedData.employee_id,
    center_id: validatedData.center_id,
    level: validatedData.level,
    is_active: validatedData.is_active ?? true,
  };

  return repository.create(technicianData);
}

// Cập nhật kỹ thuật viên.
async function update(id, data) {
  const technicianId = validateId(id);

  const existingTechnician = await repository.findById(technicianId);

  if (!existingTechnician) {
    throw createError("Không tìm thấy kỹ thuật viên.", 404);
  }

  const validatedData = validateData(data, true);

  const updatedData = {
    employee_id:
      validatedData.employee_id ?? existingTechnician.employee_id,

    center_id:
      validatedData.center_id ?? existingTechnician.center_id,

    level:
      validatedData.level ?? existingTechnician.level,

    is_active:
      validatedData.is_active ?? existingTechnician.is_active,
  };

  return repository.update(technicianId, updatedData);
}

// Xóa kỹ thuật viên.
async function remove(id) {
  const technicianId = validateId(id);

  const existingTechnician = await repository.findById(technicianId);

  if (!existingTechnician) {
    throw createError("Không tìm thấy kỹ thuật viên.", 404);
  }

  return repository.remove(technicianId);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
