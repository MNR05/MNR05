-- Manual SQL smoke checks for a dedicated demo database.
-- Run schema.sql and seed.demo.sql first.
-- These are read-only; complete registration and check-in tests through n8n after configuration.
SELECT event_id, title, registration_open FROM eventflow.events WHERE event_id = 'DEMO-2026';
SELECT conname, contype FROM pg_constraint
WHERE connamespace = 'eventflow'::regnamespace
ORDER BY conname;
SELECT indexname, indexdef FROM pg_indexes
WHERE schemaname = 'eventflow' ORDER BY indexname;

-- Expected: eventflow_event_email_unique, eventflow_event_ticket_unique,
-- eventflow_checkin_primary, eventflow_checkin_registration_fk.
-- The actual INSERT/ON CONFLICT behavior must be verified with fictional test requests.
