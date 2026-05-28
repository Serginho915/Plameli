from django.core.management.base import BaseCommand

from content.models import BlogPost, ContentPage, EducationItem, EducationModule


class Command(BaseCommand):
    help = "Seed demo content for frontend-aligned APIs"

    def handle(self, *args, **options):
        self._seed_pages()
        self._seed_blog_posts()
        self._seed_education_items()
        self.stdout.write(self.style.SUCCESS("Demo data seeded."))

    def _seed_pages(self):
        pages = [
            {
                "slug": "about",
                "title_ru": "About us",
                "title_bg": "About us",
                "title_en": "About us",
                "content_ru": "We help businesses with accounting in Bulgaria.",
                "content_bg": "We help businesses with accounting in Bulgaria.",
                "content_en": "We help businesses with accounting in Bulgaria.",
            },
            {
                "slug": "contact",
                "title_ru": "Contact",
                "title_bg": "Contact",
                "title_en": "Contact",
                "content_ru": "Reach out at hello@plameli.com",
                "content_bg": "Reach out at hello@plameli.com",
                "content_en": "Reach out at hello@plameli.com",
            },
        ]
        for payload in pages:
            ContentPage.objects.update_or_create(slug=payload["slug"], defaults=payload)

    def _seed_blog_posts(self):
        posts = [
            {
                "external_id": "b1",
                "slug": "how-to-start",
                "author": "Olena Shopova",
                "tags": ["career", "education"],
                "media_src": "/images/Blog/how-to-start.png",
                "date_label_ru": "5 March 2026",
                "date_label_bg": "5 March 2026",
                "date_label_en": "5 March 2026",
                "title_ru": "How to start accounting career in Bulgaria",
                "title_bg": "How to start accounting career in Bulgaria",
                "title_en": "How to start accounting career in Bulgaria",
                "content_ru": [
                    "Demand for accounting specialists in Bulgaria is strong.",
                    "This guide explains practical first steps.",
                ],
                "content_bg": [
                    "Demand for accounting specialists in Bulgaria is strong.",
                    "This guide explains practical first steps.",
                ],
                "content_en": [
                    "Demand for accounting specialists in Bulgaria is strong.",
                    "This guide explains practical first steps.",
                ],
            },
            {
                "external_id": "b2",
                "slug": "taxes-2024",
                "author": "Olena Shopova",
                "tags": ["taxes", "freelance"],
                "media_src": "/images/Blog/taxes-2024.png",
                "date_label_ru": "12 March 2026",
                "date_label_bg": "12 March 2026",
                "date_label_en": "12 March 2026",
                "title_ru": "Taxation for freelancers",
                "title_bg": "Taxation for freelancers",
                "title_en": "Taxation for freelancers",
                "content_ru": [
                    "Freelance work gives flexibility but requires tax compliance.",
                    "This article covers declaration and VAT basics.",
                ],
                "content_bg": [
                    "Freelance work gives flexibility but requires tax compliance.",
                    "This article covers declaration and VAT basics.",
                ],
                "content_en": [
                    "Freelance work gives flexibility but requires tax compliance.",
                    "This article covers declaration and VAT basics.",
                ],
            },
            {
                "external_id": "b3",
                "slug": "company-registration",
                "author": "Olena Shopova",
                "tags": ["business", "legal"],
                "media_src": "/images/Blog/company-registration.png",
                "date_label_ru": "18 March 2026",
                "date_label_bg": "18 March 2026",
                "date_label_en": "18 March 2026",
                "title_ru": "Company registration in Bulgaria",
                "title_bg": "Company registration in Bulgaria",
                "title_en": "Company registration in Bulgaria",
                "content_ru": [
                    "Bulgaria offers low tax rates and practical setup process.",
                    "Follow this checklist to register faster.",
                ],
                "content_bg": [
                    "Bulgaria offers low tax rates and practical setup process.",
                    "Follow this checklist to register faster.",
                ],
                "content_en": [
                    "Bulgaria offers low tax rates and practical setup process.",
                    "Follow this checklist to register faster.",
                ],
            },
        ]
        for payload in posts:
            BlogPost.objects.update_or_create(external_id=payload["external_id"], defaults=payload)

    def _seed_education_items(self):
        items = [
            {
                "external_id": "c1",
                "item_type": EducationItem.TYPE_COURSE,
                "slug": "osnovy-finansovogo-ucheta",
                "media_src": "/images/Education/course.png",
                "poster": "",
                "title_ru": "Accounting fundamentals",
                "title_bg": "Accounting fundamentals",
                "title_en": "Accounting fundamentals",
                "description_ru": "Entry-level accounting program with practical modules.",
                "description_bg": "Entry-level accounting program with practical modules.",
                "description_en": "Entry-level accounting program with practical modules.",
                "start_date_ru": "12 Apr 2026",
                "start_date_bg": "12 Apr 2026",
                "start_date_en": "12 Apr 2026",
                "price_ru": "150",
                "price_bg": "150",
                "price_en": "150",
                "level": EducationItem.LEVEL_BEGINNER,
                "goal": EducationItem.GOAL_PROFESSION,
                "item_format": EducationItem.FORMAT_ONLINE,
                "level_label_ru": "For beginners",
                "level_label_bg": "For beginners",
                "level_label_en": "For beginners",
                "goal_label_ru": "Accounting profession",
                "goal_label_bg": "Accounting profession",
                "goal_label_en": "Accounting profession",
                "format_label_ru": "Online",
                "format_label_bg": "Online",
                "format_label_en": "Online",
                "modules": [
                    ("Accounting basics", "Core rules and practical records."),
                    ("Tax basics", "Main taxes and declarations."),
                ],
            },
            {
                "external_id": "w1",
                "item_type": EducationItem.TYPE_WEBINAR,
                "slug": "nalogovye-deklaracii-2026",
                "media_src": "https://vjs.zencdn.net/v/oceans.mp4",
                "poster": "/images/Education/webinar.png",
                "title_ru": "Tax declaration updates 2026",
                "title_bg": "Tax declaration updates 2026",
                "title_en": "Tax declaration updates 2026",
                "description_ru": "Live webinar about upcoming declaration changes.",
                "description_bg": "Live webinar about upcoming declaration changes.",
                "description_en": "Live webinar about upcoming declaration changes.",
                "start_date_ru": "12 Apr 2026",
                "start_date_bg": "12 Apr 2026",
                "start_date_en": "12 Apr 2026",
                "price_ru": "15",
                "price_bg": "15",
                "price_en": "15",
                "level": EducationItem.LEVEL_EXPERIENCED,
                "goal": EducationItem.GOAL_TAXES,
                "item_format": EducationItem.FORMAT_LIVE,
                "level_label_ru": "Experienced",
                "level_label_bg": "Experienced",
                "level_label_en": "Experienced",
                "goal_label_ru": "Taxes and optimization",
                "goal_label_bg": "Taxes and optimization",
                "goal_label_en": "Taxes and optimization",
                "format_label_ru": "Live",
                "format_label_bg": "Live",
                "format_label_en": "Live",
                "modules": [
                    ("Law updates", "Main legal changes by topic."),
                    ("Filing practice", "How to submit forms correctly."),
                ],
            },
        ]

        for payload in items:
            modules = payload.pop("modules")
            obj, _ = EducationItem.objects.update_or_create(
                external_id=payload["external_id"],
                defaults=payload,
            )
            obj.program.all().delete()
            for index, (title, description) in enumerate(modules):
                EducationModule.objects.create(
                    education_item=obj,
                    sort_order=index,
                    title_ru=title,
                    title_bg=title,
                    title_en=title,
                    description_ru=description,
                    description_bg=description,
                    description_en=description,
                )
