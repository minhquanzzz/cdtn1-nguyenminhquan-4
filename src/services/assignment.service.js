
const repository = require("../repositories/assignment.repository");

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateId(value, name) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createError(`${name} không hợp lệ.`);
  }

  return id;
}

// Chuyển thời gian ISO +07:00 thành TIMESTAMP giờ địa phương.
function validateDate(value, name) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?\+07:00$/.test(value)
  ) {
    throw createError(
      `${name} phải có định dạng YYYY-MM-DDTHH:mm:ss+07:00.`
    );
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw createError(`${name} không hợp lệ.`);
  }

  // Bảng PostgreSQL hiện tại dùng TIMESTAMP không có timezone.
  return value.slice(0, 19).replace("T", " ");
}

function validateTime(start, end) {
  if (new Date(start + "+07:00") >= new Date(end + "+07:00")) {
    throw createError(
      "Thời gian kết thúc phải sau thời gian bắt đầu."
    );
  }
}

function validateData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Dữ liệu phân công không hợp lệ.");
  }

  const ticketId = validateId(data.ticket_id, "ticket_id");
  const technicianId = validateId(
    data.technician_id,
    "technician_id"
  );
  const changedBy = validateId(data.changed_by, "changed_by");

  const start = validateDate(
    data.scheduled_start,
    "scheduled_start"
  );

  const end = validateDate(
    data.scheduled_end,
    "scheduled_end"
  );

  validateTime(start, end);

  if (
    data.note !== undefined &&
    data.note !== null &&
    (typeof data.note !== "string" || data.note.length > 500)
  ) {
    throw createError("note không được vượt quá 500 ký tự.");
  }

  return {
    ticket_id: ticketId,
    technician_id: technicianId,
    changed_by: changedBy,
    scheduled_start: start,
    scheduled_end: end,
    note: data.note?.trim() || null
  };
}

// Gợi ý kỹ thuật viên.
async function suggest(ticketId, query) {
  const id = validateId(ticketId, "ticket_id");

  const start = validateDate(
    query.scheduled_start,
    "scheduled_start"
  );

  const end = validateDate(
    query.scheduled_end,
    "scheduled_end"
  );

  validateTime(start, end);

  const result = await repository.suggest(id, start, end);

  return {
    ticket: result.ticket,
    schedule: {
      scheduled_start: start,
      scheduled_end: end
    },
    total_candidates: result.technicians.length,
    technicians: result.technicians.map((tech, index) => ({
      rank: index + 1,
      technician_id: tech.technician_id,
      employee_id: tech.employee_id,
      center_id: tech.center_id,
      level: tech.level,
      proficiency: tech.proficiency,
      workload: Number(tech.workload),
      recommendation:
        index === 0
          ? "Ưu tiên đề xuất"
          : "Kỹ thuật viên phù hợp",
      reason:
        `Cùng trung tâm, tay nghề ${tech.proficiency}/5, ` +
        `${tech.workload} lịch đang đảm nhận và không trùng lịch.`
    }))
  };
}

// Xác nhận phân công.
async function assign(data) {
  const validatedData = validateData(data);

  return repository.assign(validatedData);
}

// Danh sách phân công.
async function getAll() {
  return repository.findAll();
}

module.exports = {
  suggest,
  assign,
  getAll
};
