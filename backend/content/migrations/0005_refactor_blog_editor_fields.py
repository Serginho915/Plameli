from datetime import date, datetime

from django.db import migrations, models
import content.models


def parse_legacy_blog_date(value: str) -> date:
    if not value:
        return date.today()

    for fmt in ("%Y-%m-%d", "%d.%m.%Y", "%d %B %Y", "%d %b %Y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue

    parsed = None
    try:
        from django.utils.dateparse import parse_date

        parsed = parse_date(value)
    except Exception:
        parsed = None

    return parsed or date.today()


def paragraphs_to_html(value):
    if isinstance(value, list):
        return "".join(f"<p>{paragraph}</p>" for paragraph in value if paragraph)
    return value or ""


def forwards(apps, schema_editor):
    BlogPost = apps.get_model("content", "BlogPost")

    for post in BlogPost.objects.all():
        post.published_at = parse_legacy_blog_date(post.date_label)
        post.content_ru_html = paragraphs_to_html(post.content_ru)
        post.content_bg_html = paragraphs_to_html(post.content_bg)
        if not post.external_id:
            post.external_id = content.models.generate_blog_external_id()
        post.save(update_fields=["published_at", "content_ru_html", "content_bg_html", "external_id"])


def backwards(apps, schema_editor):
    BlogPost = apps.get_model("content", "BlogPost")

    for post in BlogPost.objects.all():
        post.date_label = post.published_at.strftime("%d %B %Y")
        post.content_ru_json = [post.content_ru_html] if post.content_ru_html else []
        post.content_bg_json = [post.content_bg_html] if post.content_bg_html else []
        post.save(update_fields=["date_label", "content_ru_json", "content_bg_json"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0004_refactor_blog_date_and_education_media"),
    ]

    operations = [
        migrations.AddField(
            model_name="blogpost",
            name="published_at",
            field=models.DateField(default=date.today),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="blogpost",
            name="content_ru_html",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="blogpost",
            name="content_bg_html",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AlterField(
            model_name="blogpost",
            name="external_id",
            field=models.CharField(default=content.models.generate_blog_external_id, editable=False, max_length=32, unique=True),
        ),
        migrations.AlterField(
            model_name="blogpost",
            name="media_src",
            field=models.CharField(blank=True, default="", max_length=500),
        ),
        migrations.RunPython(forwards, backwards),
        migrations.RemoveField(
            model_name="blogpost",
            name="date_label",
        ),
        migrations.RemoveField(
            model_name="blogpost",
            name="content_ru",
        ),
        migrations.RemoveField(
            model_name="blogpost",
            name="content_bg",
        ),
        migrations.RenameField(
            model_name="blogpost",
            old_name="content_ru_html",
            new_name="content_ru",
        ),
        migrations.RenameField(
            model_name="blogpost",
            old_name="content_bg_html",
            new_name="content_bg",
        ),
    ]