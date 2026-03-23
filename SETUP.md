# ALAMAR HOUSE — Setup & Deployment Guide

## Overview

ALAMAR HOUSE is a premium luxury villa booking website for a beachfront property in Playa Blanca, San Antero, Colombia. The site features a sophisticated design, complete booking system, and integrated Wompi payment processing.

**Live URL:** (add your deployed URL here)

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** lucide-react
- **Payment:** Wompi (Sandbox & Production)
- **Deployment:** Vercel (recommended)

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/alamar-house.git
   cd alamar-house
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Wompi credentials (get from dashboard):
   - `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` (public, safe)
   - `WOMPI_PRIVATE_KEY` (secret, keep safe)
   - `WOMPI_EVENTS_KEY` (webhook validation)
   - `NEXT_PUBLIC_BASE_URL=http://localhost:3000`

4. **Start development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## Wompi Payment Integration

### Getting Wompi Credentials

1. Create a merchant account at [wompi.co](https://wompi.co)
2. Go to **Settings > API Keys**
3. Use **SANDBOX** keys for testing
4. Copy the following:
   - Public Key
   - Private Key
   - Events Key (for webhooks)

### Testing Payments in Sandbox Mode

**Test Card Numbers:**
- Approved: `4242 4242 4242 4242`
- Declined: `5105 1051 0510 5100`

**Expiry:** Any future date (MM/YY)  
**CVC:** Any 3 digits

### Production Deployment

When deploying to production:

1. Request **PRODUCTION** API keys from Wompi
2. Update environment variables in Vercel:
   - Dashboard → Settings → Environment Variables
   - Change all keys to production values
   - Set `WOMPI_ENV=production`

3. Configure Webhook URL in Wompi Dashboard:
   ```
   https://yourdomain.com/api/wompi/webhook
   ```

4. Test thoroughly before going live

---

## Deployment to Vercel

### Automatic Deployment

1. **Connect GitHub**
   - Push code to GitHub
   - Import project in Vercel
   - Vercel automatically deploys on push

2. **Add Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Use SANDBOX keys initially

3. **Deploy**
   ```bash
   git push origin main
   ```
   Vercel will automatically build and deploy

### Manual Deployment

```bash
pnpm install -g vercel
vercel
```

---

## Project Structure

```
/app
  /api/wompi
    /checkout/route.ts       # Creates checkout sessions
    /webhook/route.ts        # Receives payment updates
  /pago/resultado/page.tsx   # Payment result page
  /reserva/page.tsx          # Booking form page
  /page.tsx                  # Homepage
  /layout.tsx                # Root layout with fonts

/components
  /home                      # Homepage sections
    /hero-section.tsx
    /experience-section.tsx
    /gallery-section.tsx
    /rooms-section.tsx
    /amenities-section.tsx
    /pricing-section.tsx
    /rules-section.tsx
    /location-section.tsx
    /testimonials-section.tsx
    /faq-section.tsx
    /final-cta-section.tsx
  /booking
    /reservation-form.tsx    # Main booking form
    /summary-panel.tsx       # Price summary
  /shared
    /navbar.tsx              # Navigation
    /footer.tsx              # Footer with WhatsApp
  /ui                        # shadcn/ui components

/lib
  /pricing.ts                # Price calculations
  /wompi.ts                  # Wompi integration utilities
  /utils.ts                  # General utilities

/styles
  /globals.css               # Tailwind config & theme

/.env.example                # Environment template
/SETUP.md                    # This file
```

---

## Features

### Homepage
- Full-screen hero with property image
- Experience storytelling sections
- Photo gallery with lightbox
- Room details and capacity info
- Amenities grid (12 items)
- Pricing table (regular & high season)
- House rules section
- Location map and details
- Guest testimonials (4 reviews)
- FAQ accordion (9 questions)
- Final CTA section
- Sticky navbar with mobile menu
- WhatsApp floating button
- Professional footer

### Booking System
- Reservation form with validation
- Real-time price calculation
- High season detection
- Responsive layout (form + summary)
- Guest count selector (1-20)
- Additional message field
- Integrated with Wompi checkout

### Payment Processing
- Wompi sandbox integration ready
- Secure checkout flow
- Payment status page (approved/pending/declined/error)
- Webhook endpoint for updates
- Transaction reference tracking
- Error handling and retries

---

## Customization

### Changing Colors
Edit `/app/globals.css` — all colors are CSS variables:
```css
:root {
  --primary: #1B4D5C;        /* Ocean blue */
  --accent: #D4A574;         /* Gold */
  --sage: #7BA696;           /* Sage green */
  /* ... more variables ... */
}
```

### Updating Images
Images are loaded from Vercel Blob. Update image URLs in:
- `/components/home/hero-section.tsx`
- `/components/home/experience-section.tsx`
- `/components/home/gallery-section.tsx`
- Other sections as needed

### Updating Text Content
Edit individual section files in `/components/home/`

### Adding Database
When ready to persist bookings:
1. Choose a database (PostgreSQL recommended)
2. Create schema for `reservations` table
3. Update `/lib/wompi.ts` with database calls
4. Update webhook handler to save payment status

---

## API Routes

### POST /api/wompi/checkout
**Creates a Wompi checkout session**

Request:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+57 300 000 0000",
  "checkIn": "2026-06-15",
  "checkOut": "2026-06-18",
  "nights": 3,
  "totalAmount": 6000000,
  "pricePerNight": 2000000,
  "guests": 4,
  "message": "Birthday celebration"
}
```

Response:
```json
{
  "success": true,
  "reference": "ALAMAR-1719345600000-abc123",
  "checkoutUrl": "https://checkout.wompi.co/sandbox?...",
  "amount": 6000000
}
```

### POST /api/wompi/webhook
**Receives payment status updates from Wompi**

Wompi sends events when:
- Payment is approved
- Payment is pending
- Payment is declined
- Payment encounters an error

Configure webhook URL in Wompi dashboard.

---

## Environment Variables

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Yes | `pub_sandbox_abc123` | Get from Wompi dashboard |
| `WOMPI_PRIVATE_KEY` | Yes | `priv_sandbox_xyz789` | Keep secret, use in Vercel only |
| `WOMPI_EVENTS_KEY` | Yes | `events_sandbox_key` | For webhook validation |
| `WOMPI_ENV` | Yes | `sandbox` | Set to `production` for live |
| `NEXT_PUBLIC_BASE_URL` | Yes | `https://domain.com` | For redirects after payment |

---

## Troubleshooting

### Wompi Checkout Not Loading
- Verify public key is correct and prefixed with `pub_`
- Check `WOMPI_ENV` matches key environment
- Ensure `NEXT_PUBLIC_BASE_URL` is set correctly

### Webhook Not Receiving Events
- Confirm webhook URL in Wompi dashboard
- Check API route returns 200 status
- Verify events are enabled in Wompi dashboard
- Check environment key is correct

### Pricing Calculation Issues
- Verify date format (YYYY-MM-DD)
- Check high season dates in `/lib/pricing.ts`
- Ensure check-out is after check-in

---

## Performance Tips

- Images are optimized via Next.js Image component
- Lazy loading on sections improves initial load
- CSS animations use GPU acceleration
- Form validation prevents unnecessary API calls

---

## Security Considerations

- Never commit `.env.local` file
- Keep `WOMPI_PRIVATE_KEY` secret
- Validate all form input server-side
- Use HTTPS in production
- Enable CORS properly for API routes
- Validate webhook signatures

---

## Future Enhancements

- [ ] Database integration for reservations
- [ ] Email confirmations via Resend/SendGrid
- [ ] Admin dashboard for bookings
- [ ] Automated calendar/availability system
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Review/ratings system
- [ ] Promo code/discount system
- [ ] Dynamic pricing based on availability

---

## Support & Contact

For issues or questions:
- Email: hola@alamarhouse.co
- WhatsApp: +57 300 000 0000
- Website: [alamarhouse.co](https://alamarhouse.co)

---

## License

© 2026 ALAMAR HOUSE. All rights reserved.

---

## Changelog

### v1.0.0 (2026-03-23)
- Initial launch
- Complete homepage with 11 sections
- Booking form with real-time pricing
- Wompi payment integration (sandbox)
- Payment result page
- Responsive mobile design
- SEO optimized metadata
