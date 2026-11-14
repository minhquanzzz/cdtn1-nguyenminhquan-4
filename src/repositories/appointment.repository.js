
const pool = require("../config/database");

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Lấy danh sách lịch hẹn.
async function findAll() {
  const result = await pool.query(`
    SELECT
      a.appointment_id,
      a.ticket_id,
      t.ticket_code,
      t.issue_desc,
      t.center_id,
      a.technician_id,
      tech.employee_id,
      a.status,
      a.note,
      a.scheduled_start,
      a.scheduled_end,
      a.created_at
    FROM appointment a
    JOIN ticket t ON t.ticket_id = a.ticket_id
    LEFT JOIN technician tech
      ON tech.technician_id = a.technician_id
    ORDER BY a.scheduled_start DESC
  `);

  return result.rows;
}

// Lấy chi tiết lịch hẹn.
async function findById(id) {
  const result = await pool.query(
    `
      SELECT
        a.appointment_id,
        a.ticket_id,
        t.ticket_code,
        t.issue_desc,
        t.center_id,
        a.technician_id,
        tech.employee_id,
        a.status,
        a.note,
        a.scheduled_start,
        a.scheduled_end,
        a.created_at
      FROM appointment a
      JOIN ticket t ON t.ticket_id = a.ticket_id
      LEFT JOIN technician tech
        ON tech.technician_id = a.technician_id
      WHERE a.appointment_id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

// Kiểm tra Ticket và lấy trung tâm.
async function checkTicket(client, ticketId) {
  const result = await client.query(
    `
      SELECT ticket_id, center_id
      FROM ticket
      WHERE ticket_id = $1
      FOR SHARE
    `,
    [ticketId]
  );

  if (!result.rows[0]) {
    throw createError("Không tìm thấy phiếu bảo hành.", 404);
  }

  return result.rows[0];
}

// Kiểm tra kỹ thuật viên và khóa bản ghi
// để tránh hai yêu cầu đồng thời đặt trùng lịch.
async function checkTechnician(
  client,
  technicianId,
  centerId
) {
  if (technicianId === null) return;

  const result = await client.query(
    `
      SELECT technician_id, center_id, is_active
      FROM technician
      WHERE technician_id = $1
      FOR UPDATE
    `,
    [technicianId]
  );

  const technician = result.rows[0];

  if (!technician) {
    throw createError("Không tìm thấy kỹ thuật viên.", 404);
  }

  if (!technician.is_active) {
    throw createError("Kỹ thuật viên đã ngừng hoạt động.", 400);
  }

  if (Number(technician.center_id) !== Number(centerId)) {
    throw createError(
      "Kỹ thuật viên không thuộc trung tâm của phiếu bảo hành.",
      400
    );
  }
}

// Kiểm tra trùng lịch.
async function checkOverlap(
  client,
  technicianId,
  start,
  end,
  excludeAppointmentId = null
) {
  if (technicianId === null) return;

  const result = await client.query(
    `
      SELECT appointment_id
      FROM appointment
      WHERE technician_id = $1
        AND status <> 'CANCELLED'
        AND scheduled_start < $2
        AND scheduled_end > $3
        AND (
          $4::BIGINT IS NULL
          OR appointment_id <> $4
        )
      LIMIT 1
    `,
    [technicianId, end, start, excludeAppointmentId]
  );

  if (result.rows.length > 0) {
    throw createError(
      "Kỹ thuật viên đã có lịch hẹn trong khoảng thời gian này.",
      409
    );
  }
}

// Tạo lịch hẹn.
async function create(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ticket = await checkTicket(client, data.ticket_id);

    await checkTechnician(
      client,
      data.technician_id,
      ticket.center_id
    );

    await checkOverlap(
      client,
      data.technician_id,
      data.scheduled_start,
      data.scheduled_end
    );

    const result = await client.query(
      `
        INSERT INTO appointment (
          ticket_id,
          technician_id,
          status,
          note,
          scheduled_start,
          scheduled_end
        )
        VALUES ($1, $2, 'SCHEDULED', $3, $4, $5)
        RETURNING *
      `,
      [
        data.ticket_id,
        data.technician_id,
        data.note,
        data.scheduled_start,
        data.scheduled_end
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Cập nhật lịch hẹn.
async function update(id, data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const appointmentResult = await client.query(
      `
        SELECT *
        FROM appointment
        WHERE appointment_id = $1
        FOR UPDATE
      `,
      [id]
    );

    const existing = appointmentResult.rows[0];

    if (!existing) {
      throw createError("Không tìm thấy lịch hẹn.", 404);
    }

    if (existing.status === "CANCELLED") {
      throw createError(
        "Không thể cập nhật lịch hẹn đã hủy.",
        400
      );
    }

    const technicianId =
      data.technician_id === undefined
        ? existing.technician_id
        : data.technician_id;

    const start =
      data.scheduled_start ?? existing.scheduled_start;

    const end =
      data.scheduled_end ?? existing.scheduled_end;

    const ticket = await checkTicket(
      client,
      existing.ticket_id
    );

    await checkTechnician(
      client,
      technicianId,
      ticket.center_id
    );

    await checkOverlap(
      client,
      technicianId,
      start,
      end,
      id
    );

    const result = await client.query(
      `
        UPDATE appointment
        SET
          technician_id = $1,
          scheduled_start = $2,
          scheduled_end = $3,
          note = $4
        WHERE appointment_id = $5
        RETURNING *
      `,
      [
        technicianId,
        start,
        end,
        data.note === undefined ? existing.note : data.note,
        id
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Hủy lịch hẹn.
async function cancel(id) {
  const result = await pool.query(
    `
      UPDATE appointment
      SET status = 'CANCELLED'
      WHERE appointment_id = $1
        AND status <> 'CANCELLED'
      RETURNING *
    `,
    [id]
  );

  return result.rows[0] || null;
}

// Xóa lịch hẹn đã hủy.
async function remove(id) {
  const result = await pool.query(
    `
      DELETE FROM appointment
      WHERE appointment_id = $1
        AND status = 'CANCELLED'
      RETURNING *
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  cancel,
  remove
};
