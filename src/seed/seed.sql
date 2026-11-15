
BEGIN;

-- 1. Tao ky thuat vien mau
INSERT INTO technician (
    employee_id, center_id, level, is_active
)
VALUES
    (1001, 1, 'L2', TRUE),
    (1002, 1, 'L3', TRUE)
ON CONFLICT DO NOTHING;

-- 2. Tao phieu bao hanh mau neu chua ton tai
INSERT INTO ticket (
    ticket_code, customer_id, device_id, center_id,
    issue_desc, category_id, priority, status,
    technician_id, received_at, due_date, closed_at, is_warranty
)
VALUES
    (
        'TK-L4-001', 2001, 3001, 1,
        'May khong sac pin', 1, 'HIGH', 'MOI',
        NULL, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + INTERVAL '3 days', NULL, TRUE
    ),
    (
        'TK-L4-002', 2002, 3002, 1,
        'Man hinh khong hien thi', 2, 'MEDIUM', 'DA_PHAN_CONG',
        NULL, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + INTERVAL '5 days', NULL, TRUE
    )
ON CONFLICT (ticket_code) DO NOTHING;

-- 3. Them tay nghe cho ky thuat vien
INSERT INTO technician_skill (
    technician_id, category_id, proficiency
)
SELECT t.technician_id, s.category_id, s.proficiency
FROM (
    VALUES
        (1001::BIGINT, 1::BIGINT, 4),
        (1001::BIGINT, 2::BIGINT, 3),
        (1002::BIGINT, 1::BIGINT, 3)
) AS s(employee_id, category_id, proficiency)
JOIN technician t ON t.employee_id = s.employee_id
ON CONFLICT (technician_id, category_id) DO NOTHING;

-- 4. Gan ky thuat vien cho phieu mau thu hai
UPDATE ticket
SET technician_id = t.technician_id
FROM technician t
WHERE ticket.ticket_code = 'TK-L4-002'
  AND t.employee_id = 1001
  AND ticket.technician_id IS NULL;

-- 5. Tao lich hen neu chua co
INSERT INTO appointment (
    ticket_id, technician_id, status, note,
    scheduled_start, scheduled_end
)
SELECT
    tk.ticket_id,
    t.technician_id,
    'SCHEDULED',
    'Lich hen kiem tra thiet bi',
    CURRENT_TIMESTAMP + INTERVAL '1 day',
    CURRENT_TIMESTAMP + INTERVAL '1 day 1 hour'
FROM ticket tk
JOIN technician t ON t.employee_id = 1001
WHERE tk.ticket_code = 'TK-L4-002'
  AND NOT EXISTS (
      SELECT 1
      FROM appointment a
      WHERE a.ticket_id = tk.ticket_id
  );

-- 6. Tao lich su trang thai neu chua co
INSERT INTO ticket_status_log (
    ticket_id, from_status, to_status, changed_by, note
)
SELECT
    tk.ticket_id,
    'MOI',
    'DA_PHAN_CONG',
    9001,
    'Du lieu seed phuc vu kiem thu'
FROM ticket tk
WHERE tk.ticket_code = 'TK-L4-002'
  AND NOT EXISTS (
      SELECT 1
      FROM ticket_status_log l
      WHERE l.ticket_id = tk.ticket_id
        AND l.to_status = 'DA_PHAN_CONG'
        AND l.note = 'Du lieu seed phuc vu kiem thu'
  );

COMMIT;
