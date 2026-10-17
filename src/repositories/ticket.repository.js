
const pool = require("../config/database");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM ticket ORDER BY received_at DESC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM ticket WHERE ticket_id = $1",
    [id]
  );
  return result.rows[0] || null;
}

async function create(data) {
  const sql = `
    INSERT INTO ticket (
      ticket_code, customer_id, device_id, center_id,
      issue_desc, category_id, priority, status,
      technician_id, received_at, due_date, closed_at, is_warranty
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;

  const values = [
    data.ticket_code,
    data.customer_id,
    data.device_id,
    data.center_id,
    data.issue_desc,
    data.category_id ?? null,
    data.priority,
    data.status,
    data.technician_id ?? null,
    data.received_at,
    data.due_date,
    data.closed_at ?? null,
    data.is_warranty
  ];

  const result = await pool.query(sql, values);
  return result.rows[0];
}

async function update(id, data) {
  const sql = `
    UPDATE ticket SET
      ticket_code = $1,
      customer_id = $2,
      device_id = $3,
      center_id = $4,
      issue_desc = $5,
      category_id = $6,
      priority = $7,
      status = $8,
      technician_id = $9,
      received_at = $10,
      due_date = $11,
      closed_at = $12,
      is_warranty = $13
    WHERE ticket_id = $14
    RETURNING *
  `;

  const values = [
    data.ticket_code,
    data.customer_id,
    data.device_id,
    data.center_id,
    data.issue_desc,
    data.category_id ?? null,
    data.priority,
    data.status,
    data.technician_id ?? null,
    data.received_at,
    data.due_date,
    data.closed_at ?? null,
    data.is_warranty,
    id
  ];

  const result = await pool.query(sql, values);
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM ticket WHERE ticket_id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { findAll, findById, create, update, remove };
