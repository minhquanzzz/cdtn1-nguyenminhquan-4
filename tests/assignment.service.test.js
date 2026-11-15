const test = require("node:test");
const assert = require("node:assert/strict");

const repository = require("../src/repositories/assignment.repository");
const service = require("../src/services/assignment.service");

// Lưu lại các hàm gốc để phục hồi sau mỗi test.
const originalMethods = {
  suggest: repository.suggest,
  assign: repository.assign,
  findAll: repository.findAll,
};

function restoreRepository() {
  Object.assign(repository, originalMethods);
}

test.afterEach(() => {
  restoreRepository();
});

const validSchedule = {
  scheduled_start: "2026-11-16T09:00:00+07:00",
  scheduled_end: "2026-11-16T10:00:00+07:00",
};

test("1. Gợi ý kỹ thuật viên thành công", async () => {
  repository.suggest = async () => ({
    ticket: {
      ticket_id: 1,
      center_id: 1,
      category_id: 2,
    },
    technicians: [
      {
        technician_id: 5,
        employee_id: 1005,
        center_id: 1,
        level: "L3",
        proficiency: 5,
        workload: "2",
      },
      {
        technician_id: 3,
        employee_id: 1003,
        center_id: 1,
        level: "L2",
        proficiency: 4,
        workload: "3",
      },
    ],
  });

  const result = await service.suggest(1, validSchedule);

  assert.equal(result.ticket.ticket_id, 1);
  assert.equal(result.total_candidates, 2);
  assert.equal(result.technicians[0].technician_id, 5);
  assert.equal(result.technicians[0].rank, 1);
  assert.equal(result.technicians[0].workload, 2);
  assert.equal(
    result.technicians[0].recommendation,
    "Ưu tiên đề xuất"
  );
  assert.equal(result.technicians[1].rank, 2);
});

test("2. Từ chối gợi ý khi ticket ID không hợp lệ", async () => {
  await assert.rejects(
    service.suggest(0, validSchedule),
    {
      status: 400,
      message: "ticket_id không hợp lệ.",
    }
  );
});

test("3. Từ chối gợi ý khi thời gian không đúng định dạng", async () => {
  await assert.rejects(
    service.suggest(1, {
      scheduled_start: "16/11/2026 09:00",
      scheduled_end: "2026-11-16T10:00:00+07:00",
    }),
    {
      status: 400,
      message: /định dạng/,
    }
  );
});

test("4. Từ chối lịch phân công khi thời gian kết thúc trước thời gian bắt đầu", async () => {
  await assert.rejects(
    service.suggest(1, {
      scheduled_start: "2026-11-16T10:00:00+07:00",
      scheduled_end: "2026-11-16T09:00:00+07:00",
    }),
    {
      status: 400,
      message: /Thời gian kết thúc phải sau thời gian bắt đầu/,
    }
  );
});

test("5. Xác nhận phân công thành công với dữ liệu hợp lệ", async () => {
  let savedData;

  repository.assign = async (data) => {
    savedData = data;

    return {
      ticket: {
        ticket_id: data.ticket_id,
        technician_id: data.technician_id,
        status: "DA_PHAN_CONG",
      },
      appointment: {
        appointment_id: 10,
        ticket_id: data.ticket_id,
        technician_id: data.technician_id,
      },
    };
  };

  const result = await service.assign({
    ticket_id: 1,
    technician_id: 5,
    changed_by: 1001,
    ...validSchedule,
    note: "  Phân công kỹ thuật viên  ",
  });

  assert.equal(result.ticket.technician_id, 5);
  assert.equal(result.ticket.status, "DA_PHAN_CONG");
  assert.equal(result.appointment.appointment_id, 10);
  assert.equal(savedData.note, "Phân công kỹ thuật viên");
  assert.equal(savedData.ticket_id, 1);
  assert.equal(savedData.technician_id, 5);
});

test("6. Từ chối phân công khi thiếu ID người xác nhận", async () => {
  await assert.rejects(
    service.assign({
      ticket_id: 1,
      technician_id: 5,
      ...validSchedule,
    }),
    {
      status: 400,
      message: "changed_by không hợp lệ.",
    }
  );
});

test("7. Từ chối ghi chú vượt quá 500 ký tự", async () => {
  await assert.rejects(
    service.assign({
      ticket_id: 1,
      technician_id: 5,
      changed_by: 1001,
      ...validSchedule,
      note: "A".repeat(501),
    }),
    {
      status: 400,
      message: /500 ký tự/,
    }
  );
});

test("8. Lấy danh sách phân công thành công", async () => {
  repository.findAll = async () => [
    {
      appointment_id: 1,
      ticket_id: 10,
      technician_id: 5,
    },
    {
      appointment_id: 2,
      ticket_id: 11,
      technician_id: 6,
    },
  ];

  const result = await service.getAll();

  assert.equal(result.length, 2);
  assert.equal(result[0].technician_id, 5);
  assert.equal(result[1].ticket_id, 11);
});