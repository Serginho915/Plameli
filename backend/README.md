# Backend (Django + DRF)

## Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

## API Base

- /api/content/blog/posts/
- /api/content/education/items/
- /api/content/education/items/courses/
- /api/content/education/items/webinars/
- /api/consultations/available-slots/
- /api/consultations/bookings/
- /api/education/registrations/
- /api/feedback/

## Stripe payments

Stripe Checkout is used for consultations, courses, and webinars. Configure
the `STRIPE_*`, `FRONTEND_URL`, and API URL values from the root `.env.example`.
Course and webinar prices are read from the corresponding education item.
Consultation prices, currency, payment methods, and checkout reservation time
are controlled through `STRIPE_*` environment variables.

For local webhook forwarding:

```bash
stripe listen \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired \
  --forward-to localhost:8000/api/stripe/webhook/
```

Copy the resulting `whsec_...` value to `STRIPE_WEBHOOK_SECRET`. In production,
register `https://YOUR_DOMAIN/api/stripe/webhook/` as a Stripe webhook endpoint
for the same events. Registrations and calendar events are fulfilled only from
a signed webhook after Stripe reports a paid Checkout Session.

## Notes

- Localized content supports query parameter `lang` with `ru`, `bg`.
- Education list supports filters: `type`, `level`, `goal`, `format`.
# Google Calendar consultation booking

Consultation availability and booking use an OAuth 2.0 refresh token on the
server. Create a Google OAuth client of type **Web application**, grant the
calendar scope, generate a refresh token for the Google account that owns the
calendar, and fill the `GOOGLE_*` values from the root `.env.example`.

`GOOGLE_CALENDAR_ID` may be `primary` or a calendar ID from Google Calendar
settings. The refresh-token account must have write access to that calendar.
The configured timezone, weekdays, start times, duration, and look-ahead
window are controlled by the `CONSULTATION_*` variables.
