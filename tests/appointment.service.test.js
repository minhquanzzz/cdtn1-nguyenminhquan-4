
const test = require("node:test");
const assert = require("node:assert/strict");

const repository = require("../src/repositories/appointment.repository");
const service = require("../src/services/appointment.service");

// Lưu các hàm repository ban đầu để khôi phục sau mỗi test.
const originalMethods = {
  create: repository.create,
  findById: repository.findById,
  update: repository.update,
  cancel: repository.cancel,
  remove: repository.remove,
};

function restoreRepository() {
  Object.assign(repository, originalMethods);
}

test.afterEach(() => {
  restoreRepository();
});

// 1. Tạo lịch hẹn thành công.
test("1. Tạo lịch hẹn thành công với dữ liệu hợp lệ", async () => {
  let savedAppointment;

  repository.create = async (data) => {
    savedAppointment = {
      appointment_id: "99",
      status: "SCHEDULED",
      ...data,
    };

    return savedAppointment;
  };

  const result = await service.create({
    ticket_id: 1,
    technician_id: 2,
    scheduled_start: "2026-11-20T08:00:00+07:00",
    scheduled_end: "2026-11-20T09:00:00+07:00",
    note: "Kiểm tra thiết bị",
  });

  assert.equal(result.appointment_id, "99");
  assert.equal(result.status, "SCHEDULED");
  assert.equal(savedAppointment.ticket_id, 1);
  assert.equal(savedAppointment.technician_id, 2);
  assert.equal(savedAppointment.note, "Kiểm tra thiết bị");
  assert.equal(
    savedAppointment.scheduled_start,
    "2026-11-20T01:00:00.000Z"
  );
});

// 2. Từ chối ID ticket không hợp lệ.
test("2. Từ chối tạo lịch hẹn khi ticket ID không hợp lệ", async () => {
  await assert.rejects(
    service.create({
      ticket_id: 0,
      technician_id: 2,
      scheduled_start: "2026-11-20T08:00:00+07:00",
      scheduled_end: "2026-11-20T09:00:00+07:00",
    }),
    {
      status: 400,
      message: "ID không hợp lệ.",
    }
  );
});

// 3. Từ chối khi thiếu thời gian bắt đầu hoặc kết thúc.
test("3. Từ chối tạo lịch hẹn khi thiếu thời gian", async () => {
  await assert.rejects(
    service.create({
      ticket_id: 1,
      technician_id: 2,
      scheduled_start: "2026-11-20T08:00:00+07:00",
    }),
    {
      status: 400,
      message: "Vui lòng nhập thời gian bắt đầu và kết thúc.",
    }
  );
});

// 4. Từ chối khi thời gian kết thúc trước thời gian bắt đầu.
test("4. Từ chối lịch hẹn có thời gian kết thúc không hợp lệ", async () => {
  await assert.rejects(
    service.create({
      ticket_id: 1,
      technician_id: 2,
      scheduled_start: "2026-11-20T10:00:00+07:00",
      scheduled_end: "2026-11-20T09:00:00+07:00",
    }),
    {
      status: 400,
      message: "Thời gian kết thúc phải sau thời gian bắt đầu.",
    }
  );
});

// 5. Từ chối thời gian không có múi giờ.
test("5. Từ chối thời gian không đúng định dạng ISO 8601 có múi giờ", async () => {
  await assert.rejects(
    service.create({
      ticket_id: 1,
      technician_id: 2,
      scheduled_start: "2026-11-20T08:00:00",
      scheduled_end: "2026-11-20T09:00:00",
    }),
    {
      status: 400,
      message: /ISO 8601 có múi giờ/,
    }
  );
});

// 6. Từ chối cập nhật lịch hẹn không tồn tại.
test("6. Trả lỗi 404 khi cập nhật lịch hẹn không tồn tại", async () => {
  repository.findById = async () => null;

  await assert.rejects(
    service.update(99999, {
      note: "Cập nhật lịch hẹn",
    }),
    {
      status: 404,
      message: "Không tìm thấy lịch hẹn.",
    }
  );
});

// 7. Không cho hủy lịch hẹn đã bị hủy trước đó.
test("7. Không cho phép hủy lịch hẹn đã hủy", async () => {
  repository.findById = async () => ({
    appointment_id: 10,
    status: "CANCELLED",
  });

  await assert.rejects(
    service.cancel(10),
    {
      status: 400,
      message: "Lịch hẹn đã được hủy trước đó.",
    }
  );
});

// 8. Chỉ cho xóa lịch hẹn đã hủy.
test("8. Không cho xóa lịch hẹn chưa bị hủy", async () => {
  repository.findById = async () => ({
    appointment_id: 10,
    status: "SCHEDULED",
  });

  await assert.rejects(
    service.remove(10),
    {
      status: 400,
      message: "Chỉ được xóa lịch hẹn đã hủy. Hãy hủy lịch trước.",
    }
  );
});
