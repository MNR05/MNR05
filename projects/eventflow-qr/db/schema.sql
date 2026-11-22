-- EventFlow QR: standalone PostgreSQL schema for a fictional demo.
-- Review in a disposable database before running. Never apply to a shared/production DB blindly.
-- Does not contain personal or institutional data.
CREATE SCHEMA IF NOT EXISTS eventflow;

CREATE TABLE IF NOT EXISTS eventflow.events (
    event_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    registration_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT eventflow_event_id_format CHECK (event_id ~ '^[A-Za-z0-9_-]{2,64}$')
);

CREATE TABLE IF NOT EXISTS eventflow.registrations (
    registration_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL REFERENCES eventflow.events(event_id) ON DELETE RESTRICT,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    qr_token UUID NOT NULL UNIQUE,
    consent BOOLEAN NOT NULL,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT eventflow_name_not_blank CHECK (length(btrim(full_name)) >= 2),
    CONSTRAINT eventflow_consent_required CHECK (consent IS TRUE),
    CONSTRAINT eventflow_email_not_blank CHECK (position('@' IN email) > 1),
    CONSTRAINT eventflow_event_ticket_unique UNIQUE(event_id, qr_token)
);

-- Prevent duplicate registrations independent of letter casing or surrounding spaces.
CREATE UNIQUE INDEX IF NOT EXISTS eventflow_event_email_unique
    ON eventflow.registrations (event_id, lower(btrim(email)));

CREATE TABLE IF NOT EXISTS eventflow.checkins (
    event_id VARCHAR(64) NOT NULL,
    qr_token UUID NOT NULL,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT eventflow_checkin_primary PRIMARY KEY (event_id, qr_token),
    CONSTRAINT eventflow_checkin_registration_fk
        FOREIGN KEY (event_id, qr_token)
        REFERENCES eventflow.registrations (event_id, qr_token)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS eventflow_registration_event_idx
    ON eventflow.registrations (event_id, registered_at DESC);

-- Recommended DB role: a separate least-privileged n8n application role.
-- Provision it privately, not with hardcoded passwords in this public SQL file.
-- GRANT USAGE ON SCHEMA eventflow TO <app_role>;
-- GRANT SELECT ON eventflow.events TO <app_role>;
-- GRANT SELECT, INSERT ON eventflow.registrations, eventflow.checkins TO <app_role>;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA eventflow TO <app_role>;
