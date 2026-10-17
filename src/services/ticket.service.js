
const repository = require("../repositories/ticket.repository");

async function getAll() {
  return repository.findAll();
}

async function getById(id) {
  const ticket = await repository.findById(id);

  if (!ticket) {
    const error = new Error("Không tìm thấy phiếu bảo hành.");
    error.status = 404;
    throw error;
  }

  return ticket;
}

async function create(data) {
  const requiredFields = [
    "ticket_code",
    "customer_id",
    "device_id",
    "center_id",
    "issue_desc",
    "priority",
    "status",
    "received_at",
    "due_date",
    "is_warranty"
  ];

  const missing = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null
  );

  if (missing.length) {
    const error = new Error(
      `Thiếu trường bắt buộc: ${missing.join(", ")}`
    );
    error.status = 400;
    throw error;
  }

  if (new Date(data.due_date) < new Date(data.received_at)) {
    const error = new Error(
      "due_date không được trước received_at."
    );
    error.status = 400;
    throw error;
  }

  return repository.create(data);
}

async function update(id, data) {
  const existing = await repository.findById(id);

  if (!existing) {
    const error = new Error("Không tìm thấy phiếu bảo hành.");
    error.status = 404;
    throw error;
  }

  const fields = [
    "ticket_code", "customer_id", "device_id", "center_id",
    "issue_desc", "category_id", "priority", "status",
    "technician_id", "received_at", "due_date", "closed_at",
    "is_warranty"
  ];

  const merged = { ...existing, ...data };

  for (const field of fields) {
    if (merged[field] === undefined) {
      const error = new Error(`Thiếu trường ${field}.`);
      error.status = 400;
      throw error;
    }
  }

  return repository.update(id, merged);
}

async function remove(id) {
  const deleted = await repository.remove(id);

  if (!deleted) {
    const error = new Error("Không tìm thấy phiếu bảo hành.");
    error.status = 404;
    throw error;
  }

  return deleted;
}

module.exports = { getAll, getById, create, update, remove };
