-- Optional fictional example event. Only run after schema.sql in a disposable demo DB.
INSERT INTO eventflow.events (event_id, title, registration_open)
VALUES ('DEMO-2026', 'Demo Technology Meetup', TRUE)
ON CONFLICT (event_id) DO NOTHING;
