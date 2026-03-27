# ALAMAR BEACH HOUSE — Quick Start Guide

## 30-Second Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env.local

# 3. Add Wompi keys to .env.local
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=your_sandbox_key
WOMPI_PRIVATE_KEY=your_sandbox_key
WOMPI_EVENTS_KEY=your_sandbox_key
WOMPI_ENV=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 4. Run locally
pnpm dev

# 5. Open browser
# http://localhost:3000
```

---

## Get Wompi Credentials (2 min)

1. Go to [wompi.co](https://wompi.co)
2. Sign up as merchant
3. Click Settings > API Keys
4. Copy keys (sandbox mode)
5. Paste into `.env.local`

---

## Test Payment (1 min)

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Reservar ahora"
3. Fill form with test dates
4. Click "Proceder al pago"
5. Use test card: `4242 4242 4242 4242`
6. Any future expiry, any CVC
7. Click "Pay" → See result page

---

## Deploy to Vercel (3 min)

```bash
npm install -g vercel
vercel
# Follow prompts to connect GitHub and deploy
```

Or manually push to GitHub:
```bash
git push origin main
# Vercel auto-deploys
```

Then add env vars in Vercel Settings.

---

## Key Files

| File | Purpose |
|------|---------|
| `/app/page.tsx` | Homepage |
| `/app/reserva/page.tsx` | Booking page |
| `/app/pago/resultado/page.tsx` | Payment result |
| `/app/api/wompi/checkout/route.ts` | Create checkout |
| `/app/api/wompi/webhook/route.ts` | Receive updates |
| `/lib/pricing.ts` | Price calculations |
| `/lib/wompi.ts` | Payment utilities |
| `.env.example` | Environment template |
| `SETUP.md` | Full setup guide |

---

## Common Tasks

### Change Text Content
```bash
# Edit homepage sections
vi components/home/hero-section.tsx
vi components/home/experience-section.tsx
# ... etc
```

### Update Images
```bash
# Replace image URLs in section files
# Images are from Vercel Blob
```

### Change Colors
```bash
# Edit CSS variables
vi app/globals.css
# :root { --primary: #1B4D5C; }
```

### Update Pricing
```bash
# Edit pricing constants
vi lib/pricing.ts
# PRICING.regular = 2000000
# PRICING.highSeason = 3500000
```

### Update High Season Dates
```bash
# Edit seasonal ranges
vi lib/pricing.ts
# HIGH_SEASON_RANGES array
```

---

## Production Checklist

- [ ] Test all pages load
- [ ] Test booking form validation
- [ ] Test payment flow with sandbox card
- [ ] Update contact info (WhatsApp, email)
- [ ] Update copyright year
- [ ] Request production Wompi keys
- [ ] Update env vars to production keys
- [ ] Configure webhook URL in Wompi
- [ ] Test with real payment method
- [ ] Set up monitoring/alerts
- [ ] Enable analytics
- [ ] Review security settings

---

## Troubleshooting

**"Wompi keys not found"**
→ Check `.env.local` file exists and has keys

**"Checkout page blank"**
→ Verify `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` is correct

**"Form validation error"**
→ Check all required fields are filled

**"Payment not redirecting"**
→ Verify `NEXT_PUBLIC_BASE_URL` in .env.local

**"Webhook not working"**
→ Configure URL in Wompi Settings > Webhooks

---

## Documentation

- `SETUP.md` - Complete setup & deployment
- `BUILD_SUMMARY.md` - What was built
- `QUICK_START.md` - This file

---

## Support

- **Wompi Docs:** https://docs.wompi.co
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## Key Numbers

- 11 homepage sections
- 12 amenities shown
- 9 FAQ items
- 4 testimonials
- 20 max guests
- 4 rooms, 5 baths
- 2 payment APIs
- 4 payment statuses

---

**Ready to launch? Let's go! 🚀**
