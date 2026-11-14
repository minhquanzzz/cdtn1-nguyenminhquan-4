
const pool = require("../config/database");

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Tìm phiếu bảo hành.
async function findTicket(ticketId) {
  const result = await pool.query(
    `
      SELECT ticket_id, ticket_code, center_id,
             category_id, status, technician_id
      FROM ticket
      WHERE ticket_id = $1
    `,
    [ticketId]
  );

  return result.rows[0] || null;
}

// Gợi ý kỹ thuật viên phù hợp.
async function suggest(ticketId, start, end) {
  const ticket = await findTicket(ticketId);

  if (!ticket) {
    throw createError("Không tìm thấy phiếu bảo hành.", 404);
  }

  if (!ticket.category_id) {
    throw createError(
      "Phiếu bảo hành chưa được phân loại sự cố.",
      400
    );
  }

  const result = await pool.query(
    `
      SELECT
        tech.technician_id,
        tech.employee_id,
        tech.center_id,
        tech.level,
        skill.proficiency,

        (
          SELECT COUNT(*)
          FROM appointment ap
          WHERE ap.technician_id = tech.technician_id
            AND ap.status = 'SCHEDULED'
            AND ap.scheduled_end >= CURRENT_TIMESTAMP
        ) AS workload

      FROM technician tech

      INNER JOIN technician_skill skill
        ON skill.technician_id = tech.technician_id

      WHERE tech.center_id = $1
        AND tech.is_active = TRUE
        AND skill.category_id = $2
        AND skill.proficiency >= 3

        AND NOT EXISTS (
          SELECT 1
          FROM appointment ap
          WHERE ap.technician_id = tech.technician_id
            AND ap.status <> 'CANCELLED'
            AND ap.scheduled_start < $4
            AND ap.scheduled_end > $3
        )

      ORDER BY
        workload ASC,
        skill.proficiency DESC,
        tech.technician_id ASC
    `,
    [ticket.center_id, ticket.category_id, start, end]
  );

  return {
    ticket,
    technicians: result.rows
  };
}

// Xác nhận phân công.
async function assign(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Khóa Ticket để tránh phân công đồng thời.
    const ticketResult = await client.query(
      `
        SELECT *
        FROM ticket
        WHERE ticket_id = $1
        FOR UPDATE
      `,
      [data.ticket_id]
    );

    const ticket = ticketResult.rows[0];

    if (!ticket) {
      throw createError("Không tìm thấy phiếu bảo hành.", 404);
    }

    if (ticket.technician_id !== null) {
      throw createError(
        "Phiếu đã được phân công. Hãy sử dụng chức năng đổi kỹ thuật viên.",
        409
      );
    }

    if (!ticket.category_id) {
      throw createError(
        "Phiếu chưa có nhóm sự cố để kiểm tra tay nghề."
      );
    }

    // Khóa kỹ thuật viên để tránh phân công trùng đồng thời.
    const technicianResult = await client.query(
      `
        SELECT *
        FROM technician
        WHERE technician_id = $1
        FOR UPDATE
      `,
      [data.technician_id]
    );

    const technician = technicianResult.rows[0];

    if (!technician) {
      throw createError("Không tìm thấy kỹ thuật viên.", 404);
    }

    if (!technician.is_active) {
      throw createError("Kỹ thuật viên không hoạt động.");
    }

    // Kiểm tra cùng trung tâm.
    if (
      Number(technician.center_id) !==
      Number(ticket.center_id)
    ) {
      throw createError(
        "Kỹ thuật viên không thuộc trung tâm của phiếu."
      );
    }

    // Kiểm tra tay nghề.
    const skillResult = await client.query(
      `
        SELECT proficiency
        FROM technician_skill
        WHERE technician_id = $1
          AND category_id = $2
      `,
      [data.technician_id, ticket.category_id]
    );

    const skill = skillResult.rows[0];

    if (!skill || skill.proficiency < 3) {
      throw createError(
        "Kỹ thuật viên chưa đủ tay nghề cho nhóm sự cố này."
      );
    }

    // Kiểm tra lịch bị trùng.
    const overlapResult = await client.query(
      `
        SELECT appointment_id
        FROM appointment
        WHERE technician_id = $1
          AND status <> 'CANCELLED'
          AND scheduled_start < $3
          AND scheduled_end > $2
        LIMIT 1
      `,
      [
        data.technician_id,
        data.scheduled_start,
        data.scheduled_end
      ]
    );

    if (overlapResult.rows.length > 0) {
      throw createError(
        "Kỹ thuật viên đã có lịch hẹn trùng thời gian.",
        409
      );
    }

    // Tạo lịch hẹn.
    const appointmentResult = await client.query(
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

    // Cập nhật Ticket.
    const updatedTicket = await client.query(
      `
        UPDATE ticket
        SET technician_id = $1,
            status = 'DA_PHAN_CONG'
        WHERE ticket_id = $2
        RETURNING *
      `,
      [data.technician_id, data.ticket_id]
    );

    // Lưu lịch sử trạng thái.
    await client.query(
      `
        INSERT INTO ticket_status_log (
          ticket_id,
          from_status,
          to_status,
          changed_by,
          note
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        data.ticket_id,
        ticket.status,
        'DA_PHAN_CONG',
        data.changed_by,
        data.note || 'Phan cong ky thuat vien'
      ]
    );

    await client.query("COMMIT");

    return {
      ticket: updatedTicket.rows[0],
      appointment: appointmentResult.rows[0]
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Danh sách phân công đã tạo.
async function findAll() {
  const result = await pool.query(
    `
      SELECT
        ap.appointment_id,
        ap.ticket_id,
        t.ticket_code,
        t.center_id,
        t.category_id,
        ap.technician_id,
        tech.employee_id,
        ap.status,
        ap.scheduled_start,
        ap.scheduled_end,
        ap.note
      FROM appointment ap
      INNER JOIN ticket t
        ON t.ticket_id = ap.ticket_id
      LEFT JOIN technician tech
        ON tech.technician_id = ap.technician_id
      WHERE ap.technician_id IS NOT NULL
      ORDER BY ap.created_at DESC
    `
  );

  return result.rows;
}

module.exports = {
  findTicket,
  suggest,
  assign,
  findAll
};
