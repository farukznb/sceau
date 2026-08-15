# Sceau — Auth + Stripe escrow prototype

This branch replaces the demo login scaffold with a production-oriented NextAuth + Prisma setup and Stripe escrow prototype endpoints.

## Environment

Copy `.env.example` to `.env` and set values:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET`
- `STRIPE_WEBHOOK_SECRET`
- `INSTAGRAM_CLIENT_ID` / `INSTAGRAM_CLIENT_SECRET` (placeholder)
- `TIKTOK_CLIENT_ID` / `TIKTOK_CLIENT_SECRET` (placeholder)

## Prisma + NextAuth setup

A minimal Prisma schema is at `/home/runner/work/sceau/sceau/prisma/schema.prisma` with NextAuth models (`User`, `Account`, `Session`, `VerificationToken`) and an extra `password` field for credentials auth.

Do not run migrations automatically in CI or runtime.

Manual commands:

1. `npm run prisma:generate`
2. `npx prisma migrate dev --name init` (manual step, run locally when your DB is ready)

## Credentials login

`/home/runner/work/sceau/sceau/pages/api/auth/[...nextauth].ts` uses NextAuth with Prisma adapter and a credentials provider.

Password verification uses `bcrypt` against `User.password` hash.

To create a demo user locally, hash a password with Node and store the hash in `User.password`:

```bash
node -e "require('bcrypt').hash('demo1234', 10).then(console.log)"
```

## OAuth placeholders (Instagram/TikTok)

Providers are registered as placeholders and require valid app credentials + callback URLs before use in production.

## Stripe escrow prototype

- `POST /api/stripe/create-escrow`
  - Body: `{ "amount": 5000, "currency": "eur" }`
  - Creates a PaymentIntent with `capture_method: manual` (hold funds)
  - Returns `client_secret` and `payment_intent_id`

- `POST /api/stripe/release-escrow`
  - Body: `{ "paymentIntentId": "pi_..." }`
  - Requires authenticated NextAuth session
  - Captures the held PaymentIntent

- `POST /api/stripe/webhook`
  - Verifies signature using `STRIPE_WEBHOOK_SECRET`
  - Acknowledges events and logs `payment_intent.succeeded` / `payment_intent.canceled`

### Local webhook test with Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the emitted signing secret (`whsec_...`) for `STRIPE_WEBHOOK_SECRET`.

## Production hardening notes

- Replace escrow prototype with full Stripe Connect flow (connected accounts, application fees, transfer lifecycle).
- Add explicit authorization policy for release endpoint (merchant/mediator roles).
- Keep secure cookie/session settings via NextAuth and enforce HTTPS in production.
