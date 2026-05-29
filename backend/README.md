# Backend (Django + DRF)

## Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

## API Base

- /api/content/pages/
- /api/content/blog/posts/
- /api/content/education/items/
- /api/content/education/items/courses/
- /api/content/education/items/webinars/
- /api/consultations/available-slots/
- /api/consultations/bookings/
- /api/education/registrations/
- /api/feedback/

## Notes

- Localized content supports query parameter `lang` with `ru`, `bg`.
- Education list supports filters: `type`, `level`, `goal`, `format`.
