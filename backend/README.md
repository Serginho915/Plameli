# Backend (Django + DRF)

## Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

## API Base

- /api/v1/content/pages/
- /api/v1/content/blog/posts/
- /api/v1/content/education/items/
- /api/v1/content/education/items/courses/
- /api/v1/content/education/items/webinars/
- /api/v1/consultations/available-slots/
- /api/v1/consultations/bookings/
- /api/v1/education/registrations/
- /api/v1/feedback/

## Notes

- Localized content supports query parameter `lang` with `ru`, `bg`, `en`.
- Education list supports filters: `type`, `level`, `goal`, `format`.
