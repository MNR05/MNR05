# EventFlow QR — configuration and safeguards

## Status

This is an independent **portfolio starter, not a verified production app**. It intentionally contains no real organization, customer or participant data. Importing n8n workflows requires adjusting URLs, credentials and permissions. Test on a private sandbox before exposing endpoints.

## Data model: NocoBase

Create the following **General collections** in a test instance. Suggested field names match the workflow templates.

### `eventflow_events`

| Field | Type | Notes |
| --- | --- | --- |
| `eventId` | String, unique | e.g. `DEMO-2026` |
| `title` | String | Fictional event title |
| `active` | Boolean | Whether registrations are enabled |

### `eventflow_registrations`

| Field | Type | Notes |
| --- | --- | --- |
| `eventId` | String | Event reference |
| `name` | String | Minimal registrant name |
| `email` | Email / String | Registrant email |
| `qrToken` | String, unique | Random UUID, **not PII** |
| `consent` | Boolean | Consent recorded |

Add a **unique database constraint on (`eventId`, `email`)** for duplicate protection. A pre-insert lookup alone is not safe under concurrent requests.

### `eventflow_checkins`

| Field | Type | Notes |
| --- | --- | --- |
| `eventId` | String | Event reference |
| `qrToken` | String | Matches registration token |
| `checkedInAt` | DateTime | UTC time |

Add a **unique database constraint on (`eventId`, `qrToken`)** so a ticket cannot check in twice at the same event, even under simultaneous submissions. Configure constraints through your actual NocoBase/DB deployment and test rejection behavior. Do not run unreviewed SQL on shared databases.

## n8n

1. Import `n8n/register.json` and `n8n/checkin.json` in your **own test n8n instance**.
2. In each n8n **Webhook** node, set **Header Auth** and attach a dedicated Header Auth credential: name `x-eventflow-secret`, value equal to the Vercel `N8N_WEBHOOK_SHARED_KEY`. This prevents direct unauthenticated calls to n8n even if a webhook URL is exposed. Never commit the credential value.
3. Set server variable `NOCOBASE_URL` to the origin of your **test** NocoBase instance, without a trailing slash.
4. Create an **HTTP Bearer Auth** credential for a dedicated, least-privileged NocoBase API key. Assign the credential to both HTTP Request nodes.
5. Verify the API key role can only create/list the intended collections and cannot access other records. A role-specific header may be required by your setup.
6. Activate the webhooks only after tests. Record the production URLs as Vercel environment variables (never check them into Git).
7. Check the API response shapes on your NocoBase version. The example expects `{data:[...]}` from list and `{data:{...}}` from create.

NocoBase API patterns used here:
- `POST /api/eventflow_registrations:create`
- `GET /api/eventflow_registrations:list?filter=<encoded JSON>`
- `POST /api/eventflow_checkins:create`

These match NocoBase's resource/action API; actual collection, authorization and query behavior must be tested in your environment.

## Vercel

Set these **server-side** variables:

- `N8N_REGISTER_WEBHOOK_URL`: full registered n8n webhook URL.
- `N8N_CHECKIN_WEBHOOK_URL`: full check-in n8n webhook URL.
- `CHECKIN_ADMIN_TOKEN`: long random secret supplied to staff through an appropriate secure channel.
- `N8N_WEBHOOK_SHARED_KEY`: a different strong secret, sent only from Vercel to both authenticated n8n webhooks.

The QR endpoint creates an SVG from a token with the `qrcode` npm dependency; it does not contact a third-party QR service.

Deploy this folder as a **separate Vercel project root**, not the entire GitHub profile repository.

## Testing checklist

- [ ] Register with sample event and fictional attendee.
- [ ] Reject missing consent, invalid email, malformed event ID.
- [ ] Reject repeated registration (`eventId` + `email`).
- [ ] Check QR token contains no PII.
- [ ] Scan QR with camera over HTTPS and with manual fallback.
- [ ] Check-in requires valid staff key.
- [ ] Both n8n webhooks reject direct calls without the dedicated authentication header.
- [ ] Reject a ticket from a different event.
- [ ] Reject second check-in under concurrent requests.
- [ ] Confirm API keys are unavailable in browser/network assets.
- [ ] Add rate limiting, CAPTCHA/abuse protections, observability and data retention before real usage.

## Transparency

This repo shows an independent design based on real engineering patterns. It does **not** represent a claim that this precise Vercel + NocoBase version was deployed, that an external organization endorsed it, or that production security testing was completed.
