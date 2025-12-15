n8n (Orchestrator)

    WhatsApp conversation logic

    Intent detection & state transitions

    Calls Feathers services

    Calls Payment Adapter

    Sends WhatsApp messages

    Never stores secrets

    Never writes directly to Ops DB


Feathers DB Router (Control Plane + Data Access)

    Vendor routing

    Capability enforcement

    Rate limits

    Billing metering

    DB reads/writes

    Emits domain events

    No WhatsApp

    No DARAJA calls

Payment Adapter

    Talks to DARAJA

    Handles callbacks

    Fetches M-Pesa secrets securely

    Idempotency

    No business logic

    This separation is the backbone of reliability.




Define the order state machine (write this down)

Put this in a doc and enforce it in code later.

DRAFT
 ├─ addItem
 ├─ removeItem
 ├─ cancel → CANCELLED
 └─ confirm → CONFIRMED
CONFIRMED
 ├─ pay → PAID
 └─ cancel → CANCELLED
PAID
 └─ terminal
CANCELLED
 └─ terminal


Define payment rules (compliance & trust)

    Freeze these rules today:

    STK is triggered only after user replies PAY

    One STK attempt per payment_intent

    Max 3 payment_intents/day/customer

    Callback must be idempotent

    Money goes directly to vendor shortcode

    Platform never holds funds

Repositories

    orchestrator-n8n/
    workflows/
    README.md

    db-router-feathers/
    src/
    package.json
    tsconfig.json
    README.md

    payment-adapter/
    src/
    package.json
    README.md


# Migrate & Seed Platform DB
npx knex migrate:latest --env platform
npx knex seed:run --env platform

# Migrate & Seed Ops DB
npx knex migrate:latest --env ops
npx knex seed:run --env ops


# Verification checklist
-- platform DB
\dt
SELECT * FROM vendors;
SELECT * FROM catalog_items;

-- ops DB
\dt
SELECT * FROM orders;
SELECT * FROM payments;

# Creating Dedicated DB for clients
DATABASE_URL=postgres://tenant_acme:strong-password@localhost:5432/tenant_acme \
npx knex migrate:latest \
  --env tenant

# Register dedicated Enteprise User. with dedicated db instance
insert into vendors (
  id,
  name,
  isolation_level,
  db_target,
  created_at,
  updated_at
)
values (
  gen_random_uuid(),
  'ACME Enterprise',
  'dedicated_db',
  '{
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "database": "tenant_acme",
    "user": "tenant_acme",
    "passwordSecretRef": "plain:strong-password"
  }',
  now(),
  now()
)
returning id;

# Enable required capabilities
-- Enable catalog
insert into vendor_capabilities (
  id,
  vendor_id,
  capability_key,
  enabled,
  created_at
)
values (
  gen_random_uuid(),
  '<enterprise-vendor-id>',
  'commerce.catalog',
  true,
  now()
);

-- Enable orders
insert into vendor_capabilities (
  id,
  vendor_id,
  capability_key,
  enabled,
  created_at
)
values (
  gen_random_uuid(),
  '<enterprise-vendor-id>',
  'commerce.orders',
  true,
  now()
);

-- Enable payments (for later)
insert into vendor_capabilities (
  id,
  vendor_id,
  capability_key,
  enabled,
  created_at
)
values (
  gen_random_uuid(),
  '<enterprise-vendor-id>',
  'payments.mpesa_stk',
  true,
  now()
);


# Test creating order for shared db
rop@elypad-2 api % curl -X POST http://localhost:3030/orders \
  -H "Content-Type: application/json" \
  -H "x-vendor-id: c7af4716-f9ab-465d-9afb-f1047bf37a40" \
  -H "x-internal-key: dev-internal-secret" \
  -d '{
    "vendor_id": "c7af4716-f9ab-465d-9afb-f1047bf37a40",
    "customer_phone": "254703283383",
    "amount": 30
  }'
