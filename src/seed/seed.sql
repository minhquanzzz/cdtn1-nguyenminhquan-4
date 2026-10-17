
-- 1. Tao ky thuat vien mau
INSERT INTO technician (
    employee_id, center_id, level, is_active
)
VALUES
    (1001, 1, 'L2', TRUE),
    (1002, 1, 'L3', TRUE);

-- 2. Tao phieu bao hanh mau
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
        1, CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + INTERVAL '5 days', NULL, TRUE
    );

-- 3. Tay nghe cua ky thuat vien
INSERT INTO technician_skill (
    technician_id, category_id, proficiency
)
VALUES
    (1, 1, 4),
    (1, 2, 3),
    (2, 1, 3);

-- 4. Lich hen mau
INSERT INTO appointment (
    ticket_id, technician_id, status, note,
    scheduled_start, scheduled_end
)
VALUES
    (
        2, 1, 'SCHEDULED', 'Lich hen kiem tra thiet bi',
        CURRENT_TIMESTAMP + INTERVAL '1 day',
        CURRENT_TIMESTAMP + INTERVAL '1 day 1 hour'
    );

-- 5. Lich su trang thai mau
INSERT INTO ticket_status_log (
    ticket_id, from_status, to_status, changed_by, note
)
VALUES
    (2, 'MOI', 'DA_PHAN_CONG', 9001, 'Du lieu seed phuc vu kiem thu');
