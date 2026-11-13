const pool = require("../config/database");

// Lấy danh sách kỹ thuật viên.
async function findAll() {
  const result = await pool.query(`
    SELECT
      technician_id,
      employee_id,
      center_id,
      level,
      is_active
    FROM technician
    ORDER BY technician_id ASC
  `);

  return result.rows;
}

// Lấy kỹ thuật viên theo ID.
async function findById(id) {
  const result = await pool.query(
    `
      SELECT
        technician_id,
        employee_id,
        center_id,
        level,
        is_active
      FROM technician
      WHERE technician_id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

// Thêm kỹ thuật viên.
async function create(data) {
  const result = await pool.query(
    `
      INSERT INTO technician (
        employee_id,
        center_id,
        level,
        is_active
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [
      data.employee_id,
      data.center_id,
      data.level,
      data.is_active,
    ]
  );

  return result.rows[0];
}

// Cập nhật kỹ thuật viên.
async function update(id, data) {
  const result = await pool.query(
    `
      UPDATE technician
      SET
        employee_id = $1,
        center_id = $2,
        level = $3,
        is_active = $4
      WHERE technician_id = $5
      RETURNING *
    `,
    [
      data.employee_id,
      data.center_id,
      data.level,
      data.is_active,
      id,
    ]
  );

  return result.rows[0] || null;
}

// Xóa kỹ thuật viên.
async function remove(id) {
  const result = await pool.query(
    `
      DELETE FROM technician
      WHERE technician_id = $1
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
  remove,
};