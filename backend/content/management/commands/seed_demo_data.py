from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_date

from content.models import BlogPost, EducationItem, EducationModule


class Command(BaseCommand):
    help = "Seed demo content for frontend-aligned APIs"

    def handle(self, *args, **options):
        self._seed_blog_posts()
        self._seed_education_items()
        self.stdout.write(self.style.SUCCESS("Demo data seeded."))

    def _seed_blog_posts(self):
        posts = [
            {
                "slug": "how-to-start",
                "author": "Olena Shopova",
                "tags": ["career", "education"],
                "media_src": "/images/Blog/how-to-start.png",
                "published_at": parse_date("2026-03-05"),
                "title_ru": "How to start accounting career in Bulgaria",
                "title_bg": "How to start accounting career in Bulgaria",
                "content_ru": "<p>Demand for accounting specialists in Bulgaria is strong.</p><p>This guide explains practical first steps.</p>",
                "content_bg": "<p>Demand for accounting specialists in Bulgaria is strong.</p><p>This guide explains practical first steps.</p>",
            },
            {
                "slug": "taxes-2024",
                "author": "Olena Shopova",
                "tags": ["taxes", "freelance"],
                "media_src": "/images/Blog/taxes-2024.png",
                "published_at": parse_date("2026-03-12"),
                "title_ru": "Taxation for freelancers",
                "title_bg": "Taxation for freelancers",
                "content_ru": "<p>Freelance work gives flexibility but requires tax compliance.</p><p>This article covers declaration and VAT basics.</p>",
                "content_bg": "<p>Freelance work gives flexibility but requires tax compliance.</p><p>This article covers declaration and VAT basics.</p>",
            },
            {
                "slug": "company-registration",
                "author": "Olena Shopova",
                "tags": ["business", "legal"],
                "media_src": "/images/Blog/company-registration.png",
                "published_at": parse_date("2026-03-18"),
                "title_ru": "Company registration in Bulgaria",
                "title_bg": "Company registration in Bulgaria",
                "content_ru": "<p>Bulgaria offers low tax rates and practical setup process.</p><p>Follow this checklist to register faster.</p>",
                "content_bg": "<p>Bulgaria offers low tax rates and practical setup process.</p><p>Follow this checklist to register faster.</p>",
            },
        ]
        for payload in posts:
            BlogPost.objects.update_or_create(slug=payload["slug"], defaults=payload)

    def _seed_education_items(self):
        items = [
            {
                "item_type": EducationItem.TYPE_COURSE,
                "slug": "osnovy-finansovogo-ucheta",
                "image_src": "/images/Education/course.png",
                "video_src": "",
                "title_ru": "Accounting fundamentals",
                "title_bg": "Accounting fundamentals",
                "description_ru": "Entry-level accounting program with practical modules.",
                "description_bg": "Entry-level accounting program with practical modules.",
                "start_date": parse_date("2026-04-12"),
                "price": "150",
                "level": EducationItem.LEVEL_BEGINNER,
                "goal": EducationItem.GOAL_PROFESSION,
                "item_format": EducationItem.FORMAT_ONLINE,
                "modules": [
                    ("Accounting basics", "Core rules and practical records."),
                    ("Tax basics", "Main taxes and declarations."),
                ],
            },
            {
                "item_type": EducationItem.TYPE_WEBINAR,
                "slug": "nalogovye-deklaracii-2026",
                "image_src": "/images/Education/webinar.png",
                "video_src": "https://vjs.zencdn.net/v/oceans.mp4",
                "title_ru": "Tax declaration updates 2026",
                "title_bg": "Tax declaration updates 2026",
                "description_ru": "Live webinar about upcoming declaration changes.",
                "description_bg": "Live webinar about upcoming declaration changes.",
                "start_date": parse_date("2026-04-12"),
                "price": "15",
                "level": EducationItem.LEVEL_EXPERIENCED,
                "goal": EducationItem.GOAL_TAXES,
                "item_format": EducationItem.FORMAT_LIVE,
                "modules": [
                    ("Law updates", "Main legal changes by topic."),
                    ("Filing practice", "How to submit forms correctly."),
                ],
            },
        ]

        for payload in items:
            modules = payload.pop("modules")
            obj, _ = EducationItem.objects.update_or_create(
                slug=payload["slug"],
                defaults=payload,
            )
            obj.program.all().delete()
            for index, (title, description) in enumerate(modules):
                EducationModule.objects.create(
                    education_item=obj,
                    sort_order=index,
                    title_ru=title,
                    title_bg=title,
                    description_ru=description,
                    description_bg=description,
                )
