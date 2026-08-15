# Sceau — Pro Login scaffold

Quick start:
1. Copy files into a new Git repository.
2. Set environment variables (see .env.example).
3. Run locally: npm ci && npm run dev

.env (example)
- JWT_SECRET=very-strong-secret
- DATABASE_URL=postgres://user:pass@host:5432/db
- STRIPE_SECRET=sk_live_xxx
- NEXTAUTH_URL=https://yourdomain.com

Deployment options:
- Vercel: recommended for fastest Next.js deployment (automatic builds, preview deploys).
- Render / DigitalOcean App / Fly.io: good for Docker deployments and more infra control.
- Use HTTPS and set secure httpOnly cookies for session tokens.

Security notes:
- Replace demo auth with real DB + bcrypt/argon2 password hashing.
- Store tokens in server-set httpOnly cookies, not localStorage.
- Use CSP, HSTS and correct cookie flags (Secure, SameSite=strict).
- Integrate Stripe for escrow & webhooks (server-side).
