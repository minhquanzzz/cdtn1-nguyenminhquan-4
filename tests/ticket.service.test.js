
const test = require("node:test");
const assert = require("node:assert/strict");

const repository = require("../src/repositories/ticket.repository");
const service = require("../src/services/ticket.service");

const originalMethods = {
  create: repository.create,
  findById: repository.findById,
  update: repository.update,
  remove: repository.remove,
};

function restoreRepository() {
  Object.assign(repository, originalMethods);
}

test.afterEach(() => {
  restoreRepository();
});

test("1. Tạo ticket thành công với dữ liệu hợp lệ", async () => {
  let savedTicket;

  repository.create = async (data) => {
    savedTicket = { ticket_id: "99", ...data };
    return savedTicket;
  };

  const result = await service.create({
    customer_id: 2001,
    device_id: 3001,
    center_id: 1,
    issue_desc: "Máy không sạc pin",
    priority: "HIGH",
    is_warranty: true,
    category_id: 1,
  });

  assert.equal(result.ticket_id, "99");
  assert.match(result.ticket_code, /^TK-L4-[A-F0-9]{12}$/);
  assert.equal(result.status, "MOI");
  assert.equal(result.customer_id, 2001);
  assert.equal(result.priority, "HIGH");
  assert.equal(savedTicket.is_warranty, true);
  assert.ok(savedTicket.received_at);
  assert.ok(savedTicket.due_date);
});

test("2. Từ chối tạo ticket khi thiếu trường bắt buộc", async () => {
  await assert.rejects(
    service.create({
      customer_id: 2001,
      device_id: 3001,
    }),
    {
      status: 400,
      message: /Thiếu trường bắt buộc/,
    }
  );
});

test("3. Từ chối mức độ ưu tiên không hợp lệ", async () => {
  await assert.rejects(
    service.create({
      customer_id: 2001,
      device_id: 3001,
      center_id: 1,
      issue_desc: "Máy không lên nguồn",
      priority: "URGENT",
      is_warranty: true,
    }),
    {
      status: 400,
      message: /Mức độ ưu tiên/,
    }
  );
});

test("4. Trả lỗi 404 khi không tìm thấy ticket", async () => {
  repository.findById = async () => null;

  await assert.rejects(service.getById(99999), {
    status: 404,
    message: "Không tìm thấy phiếu bảo hành.",
  });
});

test("5. Không xóa ticket khi ID không tồn tại", async () => {
  repository.findById = async () => null;

  await assert.rejects(service.remove(99999), {
    status: 404,
    message: "Không tìm thấy phiếu bảo hành.",
  });
});

test("6. Từ chối ID khách hàng không hợp lệ (giá trị biên)", async () => {
  await assert.rejects(
    service.create({
      customer_id: 0,
      device_id: 3001,
      center_id: 1,
      issue_desc: "Kiểm tra dữ liệu",
      priority: "LOW",
      is_warranty: false,
    }),
    {
      status: 400,
      message: /số nguyên dương/,
    }
  );
});
