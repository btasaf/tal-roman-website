---
name: crm-connections
description: The "how everything connects" map for Tal's CRM (TalsCRM, repo C:/projects/talCRM, Asaf's) as seen from this website repo. It covers the PostgreSQL DB (local vs production, sync/migrations), the production server and deploys (EC2, SSH, PM2), Amazon SES email with bounces, complaints and unsubscribe, the email scheduler/worker/sequences, WhatsApp, the Telegram bot, the AI providers, Cardcom payments, Schooler course enrollment, Google Drive/Search Console, Zoho IMAP, login, and the website ↔ CRM contract (/api/wix/customer, /api/wix/track, every field and allowed value, CORS, env vars on both sides). Includes local runs, health checks and fixes. Use whenever someone asks about connecting, integrating, env vars, config, deploys, the server, the database, emails, unsubscribes, bounces, WhatsApp, the bot, AI, payments, Cardcom, Schooler/course links, the website API or forms, tags/statuses from the site, or "why isn't X arriving / working" (לידים לא מגיעים, מייל לא נשלח, וואטסאפ לא עובד, תשלום לא נקלט).
---

# TalsCRM: how everything connects (seen from the website repo)

You're in the **website** repo. The CRM is a separate repo at `C:/projects/talCRM` (GitHub `btasaf/redhead-crm`), and **only Asaf works on it**. From here you can explain how it works, check its health with the `talcrm` MCP tools, and fix the website side. CRM code, server, database and deploys belong to Asaf. If Tal asks for something on the CRM side, explain it in plain Hebrew and say it's for Asaf (or do it only if Asaf is the user and approves). To run a CRM npm script from here: `npm --prefix C:/projects/talCRM run <script>` (Git Bash).

Everything below comes from the CRM code and config as of 2026-10. Env vars are listed **by name only**; never print their values. Items marked *server-only* can only be confirmed by logging into the production server, which needs explicit approval.

**Safety recap** (also in this repo's `.claude/CLAUDE.md`): production DB and server are read-only unless the user approves the specific action. No deploys, migrations or `push-env` without approval. No bulk email or WhatsApp without approval. Respect `utils/marketingConsent.js`. Never rename tracking events (`claudeDocs/WEBSITE_TRACKING_EVENTS.md`).

**Tools here:** the `talcrm` MCP server (read-only, `.claude/mcp/talcrm-mcp.mjs`): `crm_health` (local/production up?), `crm_check_website_config` (is `CRM_BASE_URL` right?), `crm_email_status`, `crm_sequences` (which tag triggers which sequence, "רצף שירות" flag), `crm_event_types` (event names the CRM has received), `crm_contract` (fields and live course keys). There's no tool that reads or writes customer data, on purpose. The session-start hook also checks the CRM (see `mcp-health`).

**For Tal (in Hebrew when she writes Hebrew):** start with a one-line plain answer ("the lead didn't arrive because…"), then the fix. Offer to do the technical part. Don't paste tables of env vars at her unless she asks.

## The big picture

```
talroman.com (Next.js on Vercel, repo tal-roman-website)
  browser ──► /api/crm/save-customer, /api/crm/track, /api/crm/track/:id   (Next.js server routes)
                 │ server-to-server fetch, no auth, CRM_BASE_URL
                 ▼
CRM  http://crm.talroman.com   (EC2 Ubuntu, eu-north-1, PM2 process "index", Node on port 5000)
  ├─ PostgreSQL tals_crm (same host, localhost:5432) ── pg-boss queue (schema PGBOSS_SCHEMA)
  ├─ Email: scheduler (every N min) → pg-boss "email-send" → worker → Amazon SES (eu-north-1)
  │        ↖ SES → SNS → POST /api/email/sns-webhook (bounces/complaints)
  │        unsubscribe link → GET/POST /unsubscribe?token=JWT ; open pixel GET /track/open/:token.png
  │        copy of each sent mail → Zoho IMAP "Sent" folder
  ├─ WhatsApp: whatsapp-web.js (linked phone via QR, Chrome/puppeteer) + DB queue worker
  ├─ Schooler API (api.schooler.biz) ← enrollToSchool → personal course link (uniqueLink)
  ├─ Cardcom → POST /api/webhook/cardcom (payment → customer + tag + status)
  ├─ AI assistant (/ai-insert UI): Anthropic Claude via Agent SDK (claude-sonnet-5 / haiku)
  ├─ Google: Drive (daily DB backups), Search Console (keywords), OAuth refresh token
  └─ Admin alerts → email to ADMIN_ALERT_EMAILS via SES
Telegram bot (separate PM2 process "talcrm-bot", openclaw + OpenAI gpt-4o-mini)
  └─ POST CRM_API_URL/api/insertOrUpdateCustomers
```

## Connection tables

### 1. Database: PostgreSQL
| | |
|---|---|
| For | All CRM data, plus the pg-boss job tables (`pgboss.*`) |
| Config | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` (`models/index.js`, Sequelize, dialect `postgres`, pool max 5). `config/db.js`/`env.js` are an unused ES-module copy. Legacy MySQL `LEGECY_DB_*`/`LEGECY_DB*` is **not used** by the app, only by `standAlonePrograms/migrate-to-postgres.js`. |
| Local | `localhost:5432`, DB `tals_crm`, PostgreSQL 18 on Windows (`PG_DUMP_PATH`, `PSQL_PATH`, `PG_RESTORE_PATH`) |
| Production | Postgres on the EC2 host itself (`DB_HOST=localhost` there, with a different DB user from local). From a dev machine it's reachable only through `npm run ssh-prod-tunnel`, which maps local port **15432** to the server's 5432. Whether 5432 is closed in the AWS security group is *server-only*. |
| Schema changes | **Production runs `sequelize.sync({ alter: true })` on every start** (`server.js`), so every deploy or restart alters tables to match `models/`. Dev skips sync, so locally you run the matching script in `migrations/` (e.g. `node migrations/add-marketing-consent.js`, idempotent). After startup `utils/sequenceSync.js` fixes ID sequences. |
| Test safely | Local: `psql -h localhost -U postgres -d tals_crm -c "select count(*) from customers"`. Production: read-only SELECTs over the tunnel, **only with approval**. Better still, use the in-app AI assistant, which runs read-only SQL with `ai_settings`/`users` blocked. |
| If down | The server exits at startup (`authenticate()` fails). Everything stops: website leads return 500 and are lost (the website doesn't retry). |
| Backups | `service.backupScheduler` runs `pg_dump` at `BACKUP_SCHEDULE_CRON`, keeps copies in `BACKUP_LOCAL_DIR` and Google Drive (`BACKUP_*`, `GOOGLE_DRIVE_*`). Manual production backup: `npm run db-backup-manual` (SSH, approval). Local `BACKUP_ENABLED=false`. |

### 2. Production server and deploys
| | |
|---|---|
| Host | AWS EC2, Ubuntu, region eu-north-1, user `ubuntu`, app dir `/home/ubuntu/app/redhead-crm`. SSH alias `talcrm-prod` lives in the developer's `~/.ssh/config`, using key `talcrm-key.pem` in the repo folder. That key is gitignored and was never committed, but don't copy it around. |
| Process | PM2: `index` (the CRM, `index.js`) and `talcrm-bot` (Telegram bot). Production `.env` has no `PORT`, so Node listens on **5000**. HTTPS for `crm.talroman.com` is terminated in front of it, probably by nginx/certbot (*server-only*). The app itself has no TLS code. `NODE_ENV=production` makes Express serve `client/build`. |
| Deploy | `npm run deploy` = build the client locally → rsync `client/build/` to the server → SSH: `git pull` (from GitHub `btasaf/redhead-crm`, whatever is on the pushed branch) + `npm install` + `pm2 restart index`. `deploy-server-only` skips the client. `update` is the on-server variant. **All need explicit approval.** A restart also runs `sync({alter:true})`. |
| Env | Production `.env` lives on the server. Locally it's mirrored in `.env.prod` (gitignored). `npm run push-env` **overwrites** the server `.env` with `.env.prod` (it backs up to `.env.bak`), so it needs approval. |
| Logs | `npm run logs` / `logs:sys` / `logs:ai` (SSH, read-only, still ask first). |
| Test safely | `GET http://crm.talroman.com/api/con_test` → `{"res":"hello"}`. `GET /api/wix/test` shows the integration is alive. Both are public and read-only. |
| If down | Website leads and tracking fail (500 on the website route). Cardcom webhooks fail (Cardcom may retry, depending on its settings, *unconfirmed*). SNS bounce notifications get missed. Emails and WhatsApp stop. |

### 3. Amazon SES email, bounces, complaints, unsubscribe
| | |
|---|---|
| For | All outgoing email: sequences, manual sends, the "new lead" notification to Tal, admin alerts |
| Config | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (eu-north-1), `SES_FROM_EMAIL`, `SES_FROM_NAME` (`service.emailProviderSES.js`) |
| Local vs prod | **When `NODE_ENV` ≠ `production`, `sendEmail` returns a fake success and sends nothing.** Real sends happen in production only. |
| Bounces/complaints | SES → SNS topics → `POST /api/email/sns-webhook` (production URL `http://crm.talroman.com/api/email/sns-webhook`). The endpoint auto-confirms the subscription and **does not verify SNS signatures**. Hard bounce → `emailSubscribed=false`, `unsubscribe_reason='hard_bounce: …'`. Repeated soft bounces → `soft_bounce_max_retries_exceeded`. Complaint → `spam_complaint`. Records go to `email_bounces`. Setup: `claudeDocs/EMAIL_BOUNCE_SETUP.md`. Whether the SNS subscription is active can only be confirmed in the AWS console. |
| Unsubscribe | Each email gets a footer link "להסרה מרשימת התפוצה" = `UNSUBSCRIBE_URL?token=<JWT signed with JWT_SECRET>` (production `http://crm.talroman.com/unsubscribe`). `GET /unsubscribe` shows the page and `POST /unsubscribe` sets `emailSubscribed=false`, reason `user_request`. **Changing `JWT_SECRET` breaks every link already sent.** |
| Open tracking | 1×1 pixel `APP_BASE_URL/track/open/:token.png` → `email_open_tracking` |
| Sent copy | After a real send, `service.zohoImap` appends the message to the Zoho "Sent" folder (`ZOHO_IMAP_USER`, `ZOHO_IMAP_PASSWORD`, host `imappro.zoho.com`). If it isn't configured it's skipped with a warning. |
| Test safely | Locally, everything is stubbed, so check logs and `email_send_logs`. In production, `POST /api/admin/alerts/test` sends one email to the admin addresses (still ask first). Never "test" by sending to customers. |
| If down / bad keys | Jobs fail and retry 3×. `service.emailHealth` auto-pauses sending when failures exceed `EMAIL_FAILURE_THRESHOLD_PERCENT` within `EMAIL_FAILURE_CHECK_WINDOW_MINUTES` (`AUTO_PAUSE_ON_HIGH_FAILURE`). Tal's lead notifications silently stop (errors are only logged). |

### 4. Email scheduler, worker and sequences
| | |
|---|---|
| Flow | Customer gets a tag → `email_sequence_tags` trigger → `email_enrollments`. `service.emailScheduler` runs every `EMAIL_SCHEDULER_INTERVAL_MINUTES` (batch `SCHEDULER_BATCH_SIZE`), only during Israeli business hours unless `IGNORE_BUSINESS_HOURS=true`, and enqueues pg-boss jobs on queue `email-send`. `service.emailWorker` (`PGBOSS_*`) renders the template, adds the unsubscribe footer and pixel, checks consent, rate-limits (`MAX_EMAILS_PER_MINUTE/HOUR/DAY`) and sends via SES. |
| Consent gate | Before **every** send the worker calls `canReceiveEmail(customer, { transactional })`. Subscribed means send. A sequence marked `isTransactional` ("רצף שירות") may also reach people blocked **only** for `no_marketing_consent`. Unsubscribe, bounce and complaint blocks always win. Manual bulk sends (`POST /api/sendMassageFromServer`) go through the same worker. |
| Monitor | `GET /api/email/health`, `/api/email/pgboss/status`, `/api/email/queue/stats`, `/api/email/scheduler/status`, `/api/email/dashboard` (read-only). Write actions (`/scheduler/start|stop|run|fix-stuck`, `/emergency-stop`, enrollment pause/resume) need approval in production. |
| If down | Emails pile up as due enrollments and nothing is lost. Once restarted, the backlog sends subject to rate limits. |

### 5. WhatsApp
| | |
|---|---|
| Provider | **whatsapp-web.js**: Tal's own WhatsApp account linked by QR code, driving headless Chrome (puppeteer, `CHROME_PATH` optional). This isn't the official WhatsApp Business API. Twilio is in `package.json` but unused. |
| Config | `WHATSAPP_ENABLED` (production `true`, local `false`), `WHATSAPP_SESSION_PATH` (default `./.wwebjs_auth`, gitignored), `WHATSAPP_TIMEZONE`, `WHATSAPP_SEND_HOURS_START/END` (default 9–20), `WHATSAPP_SEND_DELAY_MIN_MS/MAX_MS` (20–60 s between messages), `WHATSAPP_BATCH_SIZE`, `WHATSAPP_BATCH_PAUSE_MS`. Runtime overrides are saved in `<session>/whatsapp-config.json`. |
| Sending | CRM UI → `POST /api/whatsapp/send` (login required) → `whatsapp_queue_jobs` → `service.whatsappWorker` sends one at a time with random delays inside send hours. Pause/resume with `/api/whatsapp/queue/pause|resume`. `INTERNAL_API_KEY` (header `x-internal-key`) protects `/api/whatsapp/health|groups|messages`, which the AI insert tool uses to read group chats. |
| Local vs prod | **There's no dev stub.** With `WHATSAPP_ENABLED=true` locally, real messages go out from whatever phone is linked in the local `.wwebjs_auth`. Keep it `false` locally unless testing with your own number. |
| Consent | No WhatsApp consent field exists in code. Treat marketing broadcasts like email and get approval for any bulk send. |
| Test safely | `GET /api/whatsapp/status` (logged in) returns `ready` / `qr_ready` / `auth_failure`. Send a single message to your own number. |
| If down | Status shows `qr_ready` or `disconnected`, and queued jobs wait. Fix: open the WhatsApp screen in the CRM UI and re-scan the QR with Tal's phone. On the server, Chrome must be installed (*server-only*). |

### 6. Telegram bot (`bot/`)
| | |
|---|---|
| What | An "openclaw" gateway (`bot/start.sh`, `bot/openclaw.template.json` → `bot/openclaw.json`). Telegram channel, model **OpenAI `gpt-4o-mini`**. Skill `create-customer` creates CRM customers. PM2 name `talcrm-bot` (`npm run bot:*-prod`). |
| Config | `TELEGRAM_BOT_TOKEN`, `OPENAI_API_KEY`, `CRM_API_URL` (production: `http://localhost:5000`, same box), `BOT_API_KEY`, `BOT_CHAT_IDS` (used by `service.botNotifications`, which nothing calls right now) |
| Calls | `POST ${CRM_API_URL}/api/insertOrUpdateCustomers` with header `X-Bot-Api-Key`. **The CRM doesn't check that header.** |
| Note | The template sets `dmPolicy: "open"`, `allowFrom: ["*"]`: anyone who finds the bot can talk to it. |
| If down | Only the Telegram shortcut stops. The CRM is unaffected. |

### 7. AI providers
| | |
|---|---|
| In-app assistant (`/ai-insert`, `services/service.aiAgent.js`) | Anthropic via `@anthropic-ai/claude-agent-sdk`. Main model `claude-sonnet-5`, fast tier `haiku`. Auth order: Claude OAuth token saved in DB `ai_settings.claude_token` (connected from the CRM UI via "login with Claude", auto-refreshed) → `CLAUDE_CODE_OAUTH_TOKEN` → `ANTHROPIC_API_KEY`. Tools: read-only `query_db` (SELECT/WITH, 200 rows, `ai_settings`/`users` blocked), WhatsApp group reading, insert-customer cards. It loads `claudeDocs/WEBSITE_TRACKING_EVENTS.md` into its prompt (which is why that file is un-ignored and must deploy). |
| Bot | OpenAI `gpt-4o-mini` (see 6) |
| If down | `GET /api/ai-insert/claude/status` isn't "ready", so reconnect from the AI screen. The rest of the CRM works. |

### 8. Cardcom payments
| | |
|---|---|
| For | A paid order creates or updates the customer, adds a tag (which can trigger a sequence), raises the status, and optionally records a tracking event |
| Endpoint | `POST /api/webhook/cardcom` (production `http://crm.talroman.com/api/webhook/cardcom`, set in Cardcom's dashboard, *confirm there*). **No signature or secret check.** Only `responsecode === '0'` is processed. |
| Mapping | Table `cardcom_configs` (managed in the CRM UI, `/api/cardcom/configs`): `numberId` = Cardcom `Custom19` → `tagId`, `statusId` (raised only if higher), `trackingEventType`, `isActive`. If nothing matches, the row with `numberId='default'` applies. Customer is matched by phone or email. Docs: `claudeDocs/CARDCOM_INTEGRATION.md`. |
| Env | None (no Cardcom API calls out) |
| Test safely | Locally: `curl -X POST http://localhost:5000/api/webhook/cardcom -H "Content-Type: application/json" -d '{"responsecode":"0","Custom19":"<numberId>","UserEmail":"<your test email>","CardOwnerName":"Test"}'`. Never against production. |
| If down | Purchases don't tag customers, so the post-purchase sequence never starts. Failures raise `PAYMENT_FAILURE` admin alerts. |

### 9. Schooler (course platform) and personal links
| | |
|---|---|
| For | `enrollToSchool` on a website form enrolls the person in a Schooler school/course, and the CRM returns `uniqueLink` (their personal course link), which the website shows or sends |
| Config | `SCHOOLER_SCHOOLER_CLIENT_ID`, `SCHOOLER_SCHOOLER_CLIENT_SECRET`, `SCHOOLER_SCHOOLER_USER_ID`, `SCHOOLER_SCHOOLER_USER_SECRET`. API `https://api.schooler.biz` (OAuth password grant; tokens cached in table `schooler_tokens`). |
| Allowed `enrollToSchool` values (`COURSE_MAP` in `services/service.schooler.js`) | `what-woman-wants`, `what-woman-wants-2`, `what-men-want`, `what-men-want-2`, `couples-want`, `couples-want-2`, `gift-course`. Anything else returns an error in `result.schoolerEnrollment` and **no `uniqueLink`**. The customer is still saved. |
| Local vs prod | **Real in both.** A local test creates a real Schooler student, so use your own email. |
| If down | The lead is saved but there's no personal link. The website shows its fallback (check the form code). |

### 10. Google (Drive backups, Search Console)
`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`, `GOOGLE_OAUTH_REFRESH_TOKEN` (one OAuth app; refresh token from `npm run setup-google-auth`; local token files `config/google-drive-*.json` are gitignored). Drive: `GOOGLE_DRIVE_ENABLED`, `GOOGLE_DRIVE_FOLDER_ID`. Search Console: `SEARCH_CONSOLE_ENABLED`, `SEARCH_CONSOLE_SITE_URL` → `/api/analytics/search-keywords`. If the refresh token is revoked or expired, backups stop going to Drive and keyword analytics turn up empty. No Google Calendar and no S3 integration exist.

### 11. CRM UI login
Passport local strategy (`services/passport.js`): username + password checked against table `users`, with the session in a cookie (cookie-session, 30 days). Routes using `requireLogin`/`requireAuth`/`ifNoUserReruenEmptyArr` are protected. There's no Google login, even though `/auth/google` routes exist without a strategy. Client dev server: `client/` CRA on port 3000, proxying to `http://localhost:5000`.

### 12. Admin alerts
`ADMIN_ALERTS_ENABLED` (local false), `ADMIN_ALERT_EMAILS`, `ADMIN_ALERT_COOLDOWN_MINUTES`. Alerts are stored in `admin_alerts` and emailed via SES (first occurrence per fingerprint, or always when critical).

## Website ↔ CRM contract

The browser never calls the CRM directly. The website's Next.js server routes call it **server-to-server, with no auth header and no shared secret**. CORS (`ALLOWED_ORIGINS` in `app.js`: localhost:3000/3001/5000, talroman.com, www, crm.talroman.com, tal-roman-website.vercel.app) doesn't apply to server calls with no `Origin`. It only matters if a browser page ever calls the CRM directly.

| Website route (repo `tal-roman-website`) | Calls CRM | CRM handler |
|---|---|---|
| `POST /api/crm/save-customer` | `POST ${CRM_BASE_URL}/wix/customer` | `POST /api/wix/customer` → `service.wix.processWixCustomer` |
| `POST /api/crm/track` | `POST ${CRM_BASE_URL}/wix/track` | `POST /api/wix/track` → `visitor_events` |
| `POST /api/crm/track/:eventId` | `PUT ${CRM_BASE_URL}/wix/track/:eventId` | `PUT /api/wix/track/:eventId` (time on page, scroll depth) |
| — | `GET ${CRM_BASE_URL}/wix/test` | health check |

**Env on the website side:** `CRM_BASE_URL`, read in `src/lib/crm-client.ts` (default `http://localhost:5000`). The client appends `/wix/...` while the CRM routes are `/api/wix/...`, so **`CRM_BASE_URL` must end in `/api`**: production `http://crm.talroman.com/api` (set in Vercel, *confirm there*), local `http://localhost:5000/api`. Without `/api`, every form post gets a CRM 404 (the session-start check warns about this).

### `POST /api/wix/customer` fields
| Field | Type / allowed values | Behaviour |
|---|---|---|
| `mail` / `phone` | string. **At least one required** (else 400) | Existing customer matched by either (email lowercased). Neither is changed on existing customers. |
| `name` or `firstname` + `lastname` | string | `name` is split on the first space. Used for new customers only. |
| `tag` | comma-separated tag names (free text) | Each is created if missing (case-insensitive match) and added via `tagManagement`, **which can auto-enroll into email sequences**. Default when empty: `הגיע מהאתר`. The website route merges `tags[]` and `geo:<lat>,<lng>` into this field. |
| `status` | status name (free text) | Created if missing. **New customers only.** Default `קר`. |
| `enrollToSchool` | one of the `COURSE_MAP` keys (see 9) | Schooler enrollment → top-level `uniqueLink` in the response |
| `notifyTal` | boolean | Emails Tal a lead summary (via SES, production only) |
| `freeText` | string | Added to the customer history as `💬 …` |
| `visitorId` | string (website localStorage `crm_visitor_id`) | Links past visitor events to the customer and records a `signup` event |
| `emailConsent` | `true`/`false` (also accepts `'true'/'on'/'yes'/1` and `'false'/'off'/'no'/0`). Missing = not asked. | New customer: `false` → `emailSubscribed=false`, reason `no_marketing_consent`. Missing → subscribed (legacy). Existing customer: `true` records consent and lifts only `no_marketing_consent`/`user_request` blocks. `false` is recorded only if there's no earlier yes. Rules: `utils/marketingConsent.js`. |
| `consentSource` | string ≤100, e.g. `quiz`, `contact` | default `website` |
| `consentText` | string ≤2000 | exact consent wording shown |

Response: `{ success, message, timestamp, result: { isNewCustomer, customerId, tagsAdded, tagNames, statusSet, statusName, schoolerEnrollment, visitorLinked }, uniqueLink?, visitorLinked? }`.

Values the website actually sends: contact and home forms take their tag/status from Sanity settings. Coaching uses tag `ליווי-אישי`, status `קר`. Course pages use tag = course slug, status `קר`. Gift pages take `crmTags`/`crmStatus`/`enrollToSchool` from the Sanity `gift` document. The quiz sends `קיבל מתנה`, `אישה`/`גבר`/`זוג`, `לבד`, `העמקה`/`שיקום`, one of ten `מייל מתנה- …` tags (these trigger the gift sequences, so mark them "רצף שירות"), plus `enrollToSchool`, `consentSource: "quiz"` and `consentText`. The full per-form table and every tracking event are in **`claudeDocs/WEBSITE_TRACKING_EVENTS.md`**, the source of truth.

### `POST /api/wix/track`
`visitorId` (required), `eventType` (required, **never rename existing names**), `eventData` (object), `pageUrl`, `referrer`. Returns `{ success, eventId, timestamp }`. `PUT /api/wix/track/:eventId` accepts `eventData`, `pageUrl`, `referrer`.

## Run locally
CRM side (Asaf's machine):
1. PostgreSQL 18 running locally with DB `tals_crm`. A `.env` in the repo root (get it from Asaf; it's never in git) with `NODE_ENV=dev`, `WHATSAPP_ENABLED=false`, `BACKUP_ENABLED=false`.
2. `npm install` and `npm install --prefix client`.
3. `npm run dev`: server on `http://localhost:5000` (nodemon) plus the client on `http://localhost:3000`. Or `npm run server` alone.
4. Schema: dev doesn't sync, so after pulling model changes run the matching `migrations/*.js` locally.
5. Website against the local CRM: `.env.local` in this repo should have `CRM_BASE_URL=http://localhost:5000/api` (`crm_check_website_config` verifies it). Run the CRM with `npm --prefix C:/projects/talCRM run server`, then `npm run dev` here. Then submit a form with **your own** email (Schooler enrollment is real).
6. Bot (rarely needed): `npm run bot` (Git Bash, needs `openclaw` installed).

## Health checks (all read-only)
| Check | Local | Production (public GET, fine to run when asked) |
|---|---|---|
| Server up | `curl http://localhost:5000/api/con_test` | `curl http://crm.talroman.com/api/con_test` |
| Website integration route | `curl http://localhost:5000/api/wix/test` | `curl http://crm.talroman.com/api/wix/test` |
| Email health / queue | `/api/email/health`, `/api/email/pgboss/status`, `/api/email/queue/stats` | same paths |
| WhatsApp | CRM UI → WhatsApp screen (`/api/whatsapp/status`, login) | same |
| AI | `/api/ai-insert/claude/status` (login) | same |
| PM2 / logs | — | `npm run logs` (SSH, ask first) |

## "Why isn't X arriving?": symptoms and fixes
| Symptom | Likely cause → fix |
|---|---|
| Website form shows an error, lead not in CRM, website log says `CRM save failed (404)` | `CRM_BASE_URL` missing the `/api` suffix (see contract) → fix it in Vercel or `.env.local` |
| `CRM save failed (5xx)` or fetch failed | CRM down or DB down → check `/api/con_test` and PM2 status (ask first). The website doesn't retry, so leads sent during the outage are lost. Check the website/Vercel logs for the payloads. |
| `400 Either email or phone is required` | The form sent neither `mail` nor `phone` |
| Lead saved but no `uniqueLink` | `enrollToSchool` isn't a `COURSE_MAP` key, Schooler credentials are wrong, or Schooler is down → read `result.schoolerEnrollment.error` |
| Tal didn't get the "new lead" email | Form didn't send `notifyTal: true`, the environment isn't production, or SES failed (only logged) |
| Sequence email never sent | Customer has `emailSubscribed=false` (check `unsubscribe_reason`). A gift sequence not marked "רצף שירות" while the person didn't tick consent. Tag not linked to the sequence. Outside business hours. Rate limits. Health auto-pause. pg-boss stuck. Check `/api/email/health` and `/api/email/scheduler/status`. Use `fix-stuck` only with approval. |
| No emails at all, locally | Expected: SES is stubbed when `NODE_ENV` ≠ `production` |
| Bounces not recorded / still emailing bounced addresses | SNS subscription to `/api/email/sns-webhook` not confirmed (check the AWS console and server logs for `SubscriptionConfirmation`) |
| Unsubscribe link says invalid/expired | `JWT_SECRET` changed, or `UNSUBSCRIBE_URL` points to the wrong host |
| Open rates are zero | `APP_BASE_URL` is wrong in production, or the mail client blocks images |
| WhatsApp messages stuck in the queue | Session dropped (status `qr_ready`) → re-scan the QR. Outside send hours (default 09–20 Israel time). Queue paused. `WHATSAPP_ENABLED` ≠ `true`. Chrome missing on the server. |
| Cardcom purchase didn't tag the customer | `Custom19` has no active row in `cardcom_configs` and there's no `default` row. `responsecode` ≠ `0`. Webhook URL in Cardcom is wrong. Check admin alerts. |
| Tracking events missing or with empty data | See `claudeDocs/WEBSITE_TRACKING_EVENTS.md` (known gaps, `crm_track_debug`). Confirm `CRM_BASE_URL`. |
| Browser shows a CORS error | Some page calls the CRM directly from a new origin → add it to `ALLOWED_ORIGINS` in `app.js` (code change, ask first), or go through the website's `/api/crm/*` routes |
| AI assistant "not connected" | The Claude token in `ai_settings` expired → reconnect in the AI screen |
| No backup in Drive | `BACKUP_ENABLED`/`GOOGLE_DRIVE_ENABLED` off, or the Google refresh token expired → `npm run setup-google-auth` |

## Security notes
Known CRM security gaps are tracked by Asaf privately, not in this repo. Don't probe CRM endpoints beyond the read-only tools above. If you notice something that looks exposed, tell the user (Asaf) instead of testing it.
