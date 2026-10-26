
const { randomBytes } = require("node:crypto");
const repository = require("../repositories/ticket.repository");

// Sinh mã ticket duy nhất với xác suất trùng rất thấp.
function generateTicketCode() {
  return `TK-L4-${randomBytes(6).toString("hex").toUpperCase()}`;
}

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

// Tạo ticket mới.
async function create(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const error = new Error("Dữ liệu ticket không hợp lệ.");
    error.status = 400;
    throw error;
  }

  const requiredFields = [
    "customer_id",
    "device_id",
    "center_id",
    "issue_desc",
    "priority",
    "is_warranty",
  ];

  const missing = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null
  );

  if (missing.length > 0) {
    const error = new Error(
      `Thiếu trường bắt buộc: ${missing.join(", ")}`
    );
    error.status = 400;
    throw error;
  }

  const customerId = Number(data.customer_id);
  const deviceId = Number(data.device_id);
  const centerId = Number(data.center_id);

  const ids = [
    [customerId, "Mã khách hàng"],
    [deviceId, "Mã thiết bị"],
    [centerId, "Mã trung tâm"],
  ];

  for (const [id, label] of ids) {
    if (!Number.isSafeInteger(id) || id <= 0) {
      const error = new Error(
        `${label} phải là số nguyên dương hợp lệ.`
      );
      error.status = 400;
      throw error;
    }
  }

  if (
    typeof data.issue_desc !== "string" ||
    !data.issue_desc.trim()
  ) {
    const error = new Error("Mô tả sự cố không được để trống.");
    error.status = 400;
    throw error;
  }

  const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

  if (!allowedPriorities.includes(data.priority)) {
    const error = new Error(
      "Mức độ ưu tiên phải là LOW, MEDIUM hoặc HIGH."
    );
    error.status = 400;
    throw error;
  }

  if (typeof data.is_warranty !== "boolean") {
    const error = new Error(
      "Trường is_warranty phải có giá trị true hoặc false."
    );
    error.status = 400;
    throw error;
  }

  let categoryId = null;

  if (data.category_id !== undefined && data.category_id !== null) {
    categoryId = Number(data.category_id);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      const error = new Error("Mã loại yêu cầu không hợp lệ.");
      error.status = 400;
      throw error;
    }
  }

  // Quy tắc hạn xử lý mặc định theo ngày lịch.
  // Điều chỉnh theo quy định nghiệp vụ chính thức nếu có.
  const dueDaysByPriority = {
    HIGH: 3,
    MEDIUM: 5,
    LOW: 7,
  };

  const receivedAt = new Date();
  const dueDate = new Date(receivedAt);

  dueDate.setDate(
    dueDate.getDate() + dueDaysByPriority[data.priority]
  );

  const ticketData = {
    ticket_code: generateTicketCode(),
    customer_id: customerId,
    device_id: deviceId,
    center_id: centerId,
    issue_desc: data.issue_desc.trim(),
    category_id: categoryId,
    priority: data.priority,
    status: "MOI",
    technician_id: null,
    received_at: receivedAt.toISOString(),
    due_date: dueDate.toISOString(),
    closed_at: null,
    is_warranty: data.is_warranty,
  };

  return repository.create(ticketData);
}

// Cập nhật ticket theo ID.
async function update(id, data) {
  const existingTicket = await repository.findById(id);

  if (!existingTicket) {
    const error = new Error("Không tìm thấy phiếu bảo hành.");
    error.status = 404;
    throw error;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    const error = new Error("Dữ liệu cập nhật không hợp lệ.");
    error.status = 400;
    throw error;
  }

  const updatedData = {
    ticket_code: data.ticket_code ?? existingTicket.ticket_code,
    customer_id: data.customer_id ?? existingTicket.customer_id,
    device_id: data.device_id ?? existingTicket.device_id,
    center_id: data.center_id ?? existingTicket.center_id,
    issue_desc: data.issue_desc ?? existingTicket.issue_desc,
    category_id: data.category_id ?? existingTicket.category_id,
    priority: data.priority ?? existingTicket.priority,
    status: data.status ?? existingTicket.status,
    technician_id:
      data.technician_id === undefined
        ? existingTicket.technician_id
        : data.technician_id,
    received_at: data.received_at ?? existingTicket.received_at,
    due_date: data.due_date ?? existingTicket.due_date,
    closed_at:
      data.closed_at === undefined
        ? existingTicket.closed_at
        : data.closed_at,
    is_warranty: data.is_warranty ?? existingTicket.is_warranty,
  };

  return repository.update(id, updatedData);
}

// Xóa ticket theo ID.
async function remove(id) {
  const ticket = await repository.findById(id);

  if (!ticket) {
    const error = new Error("Không tìm thấy phiếu bảo hành.");
    error.status = 404;
    throw error;
  }

  return repository.remove(id);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
