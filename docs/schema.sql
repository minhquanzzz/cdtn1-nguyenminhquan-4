
-- BT1 - Luong 4: Phan cong ky thuat vien va lich hen
-- PostgreSQL
-- Cac bang duoc xay dung theo DDL trong bao cao BT1.

-- 1. Bang technician
CREATE TABLE technician (
    technician_id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    center_id BIGINT NOT NULL,
    level VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Bang ticket
CREATE TABLE ticket (
    ticket_id BIGSERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    device_id BIGINT NOT NULL,
    center_id BIGINT NOT NULL,
    issue_desc TEXT NOT NULL,
    category_id INTEGER,
    priority VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    technician_id BIGINT,
    received_at TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    closed_at TIMESTAMP,
    is_warranty BOOLEAN NOT NULL,

    CONSTRAINT fk_ticket_technician
        FOREIGN KEY (technician_id)
        REFERENCES technician(technician_id)
);

-- 3. Bang technician_skill
CREATE TABLE technician_skill (
    technician_id BIGINT NOT NULL,
    category_id INTEGER NOT NULL,
    proficiency SMALLINT NOT NULL,

    CONSTRAINT pk_technician_skill
        PRIMARY KEY (technician_id, category_id),

    CONSTRAINT fk_skill_technician
        FOREIGN KEY (technician_id)
        REFERENCES technician(technician_id),

    CONSTRAINT chk_skill_proficiency
        CHECK (proficiency BETWEEN 1 AND 5)
);

-- 4. Bang appointment
CREATE TABLE appointment (
    appointment_id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    technician_id BIGINT,
    status VARCHAR(20) NOT NULL,
    note TEXT,
    scheduled_start TIMESTAMP,
    scheduled_end TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES ticket(ticket_id),

    CONSTRAINT fk_appointment_technician
        FOREIGN KEY (technician_id)
        REFERENCES technician(technician_id),

    CONSTRAINT chk_appointment_time
        CHECK (
            scheduled_start IS NULL
            OR scheduled_end IS NULL
            OR scheduled_end > scheduled_start
        )
);

-- 5. Bang ticket_status_log
CREATE TABLE ticket_status_log (
    log_id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by BIGINT NOT NULL,
    note VARCHAR(255),

    CONSTRAINT fk_status_log_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES ticket(ticket_id)
);

-- Chi muc ho tro truy van
CREATE INDEX idx_ticket_technician
    ON ticket(technician_id);

CREATE INDEX idx_appointment_ticket
    ON appointment(ticket_id);

CREATE INDEX idx_appointment_technician
    ON appointment(technician_id);

CREATE INDEX idx_appointment_status
    ON appointment(status);

CREATE INDEX idx_technician_skill_category
    ON technician_skill(category_id);

CREATE INDEX idx_status_log_ticket_changed_at
    ON ticket_status_log(ticket_id, changed_at);
