
const repository = require("../repositories/appointment.repository");

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createError("ID không hợp lệ.");
  }

  return id;
}

function validateDate(value, fieldName) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    !/(Z|[+-]\d{2}:\d{2})$/i.test(value)
  ) {
    throw createError(
      `${fieldName} phải là thời gian ISO 8601 có múi giờ.`
    );
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw createError(`${fieldName} không hợp lệ.`);
  }

  return date.toISOString();
}

function validateTime(start, end) {
  if (new Date(end).getTime() <= new Date(start).getTime()) {
    throw createError(
      "Thời gian kết thúc phải sau thời gian bắt đầu."
    );
  }
}

function validateNote(note) {
  if (note === undefined || note === null) {
    return null;
  }

  if (typeof note !== "string" || note.length > 500) {
    throw createError(
      "Ghi chú phải là chuỗi và không quá 500 ký tự."
    );
  }

  return note.trim() || null;
}

function validateTechnicianId(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return validateId(value);
}

async function getAll() {
  return repository.findAll();
}

async function getById(id) {
  const appointmentId = validateId(id);

  const appointment = await repository.findById(appointmentId);

  if (!appointment) {
    throw createError("Không tìm thấy lịch hẹn.", 404);
  }

  return appointment;
}

// Tạo lịch hẹn.
async function create(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Dữ liệu lịch hẹn không hợp lệ.");
  }

  const ticketId = validateId(data.ticket_id);

  if (
    data.scheduled_start === undefined ||
    data.scheduled_end === undefined
  ) {
    throw createError(
      "Vui lòng nhập thời gian bắt đầu và kết thúc."
    );
  }

  const start = validateDate(
    data.scheduled_start,
    "scheduled_start"
  );

  const end = validateDate(
    data.scheduled_end,
    "scheduled_end"
  );

  validateTime(start, end);

  return repository.create({
    ticket_id: ticketId,
    technician_id: validateTechnicianId(data.technician_id),
    scheduled_start: start,
    scheduled_end: end,
    note: validateNote(data.note)
  });
}

// Cập nhật lịch hẹn.
async function update(id, data) {
  const appointmentId = validateId(id);

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Dữ liệu cập nhật không hợp lệ.");
  }

  const existing = await repository.findById(appointmentId);

  if (!existing) {
    throw createError("Không tìm thấy lịch hẹn.", 404);
  }

  const start =
    data.scheduled_start === undefined
      ? new Date(existing.scheduled_start).toISOString()
      : validateDate(data.scheduled_start, "scheduled_start");

  const end =
    data.scheduled_end === undefined
      ? new Date(existing.scheduled_end).toISOString()
      : validateDate(data.scheduled_end, "scheduled_end");

  validateTime(start, end);

  const technicianId =
    data.technician_id === undefined
      ? undefined
      : validateTechnicianId(data.technician_id);

  return repository.update(appointmentId, {
    scheduled_start: start,
    scheduled_end: end,
    technician_id: technicianId,
    note:
      data.note === undefined
        ? undefined
        : validateNote(data.note)
  });
}

// Hủy lịch hẹn.
async function cancel(id) {
  const appointmentId = validateId(id);

  const existing = await repository.findById(appointmentId);

  if (!existing) {
    throw createError("Không tìm thấy lịch hẹn.", 404);
  }

  if (existing.status === "CANCELLED") {
    throw createError("Lịch hẹn đã được hủy trước đó.", 400);
  }

  return repository.cancel(appointmentId);
}

// Xóa lịch hẹn.
async function remove(id) {
  const appointmentId = validateId(id);

  const existing = await repository.findById(appointmentId);

  if (!existing) {
    throw createError("Không tìm thấy lịch hẹn.", 404);
  }

  if (existing.status !== "CANCELLED") {
    throw createError(
      "Chỉ được xóa lịch hẹn đã hủy. Hãy hủy lịch trước.",
      400
    );
  }

  return repository.remove(appointmentId);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  cancel,
  remove
};
