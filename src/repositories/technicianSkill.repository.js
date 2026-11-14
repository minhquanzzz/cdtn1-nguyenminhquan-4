
const pool = require("../config/database");

// Lấy danh sách tay nghề của một kỹ thuật viên.
async function findAllByTechnicianId(technicianId) {
  const result = await pool.query(
    `
      SELECT technician_id, category_id, proficiency
      FROM technician_skill
      WHERE technician_id = $1
      ORDER BY category_id ASC
    `,
    [technicianId]
  );

  return result.rows;
}

// Lấy tay nghề theo kỹ thuật viên và nhóm sự cố.
async function findById(technicianId, categoryId) {
  const result = await pool.query(
    `
      SELECT technician_id, category_id, proficiency
      FROM technician_skill
      WHERE technician_id = $1
        AND category_id = $2
    `,
    [technicianId, categoryId]
  );

  return result.rows[0] || null;
}

// Thêm tay nghề.
async function create(data) {
  const result = await pool.query(
    `
      INSERT INTO technician_skill (
        technician_id,
        category_id,
        proficiency
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [
      data.technician_id,
      data.category_id,
      data.proficiency,
    ]
  );

  return result.rows[0];
}

// Cập nhật tay nghề.
async function update(technicianId, categoryId, proficiency) {
  const result = await pool.query(
    `
      UPDATE technician_skill
      SET proficiency = $1
      WHERE technician_id = $2
        AND category_id = $3
      RETURNING *
    `,
    [proficiency, technicianId, categoryId]
  );

  return result.rows[0] || null;
}

// Xóa tay nghề.
async function remove(technicianId, categoryId) {
  const result = await pool.query(
    `
      DELETE FROM technician_skill
      WHERE technician_id = $1
        AND category_id = $2
      RETURNING *
    `,
    [technicianId, categoryId]
  );

  return result.rows[0] || null;
}

module.exports = {
  findAllByTechnicianId,
  findById,
  create,
  update,
  remove,
};
