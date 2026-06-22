from datetime import date, datetime

from django.db import migrations, models
import content.models


def parse_legacy_education_date(value: str) -> date:
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


def forwards(apps, schema_editor):
    EducationItem = apps.get_model("content", "EducationItem")

    for item in EducationItem.objects.all():
        source = item.start_date_ru or item.start_date_bg or ""
        item.start_date = parse_legacy_education_date(source)
        if not item.external_id:
            item.external_id = content.models.generate_education_external_id()
        item.save(update_fields=["start_date", "external_id"])


def backwards(apps, schema_editor):
    EducationItem = apps.get_model("content", "EducationItem")

    ru_level = {
        "beginner": "Начальный",
        "experienced": "Опытный",
        "business": "Бизнес",
    }
    bg_level = {
        "beginner": "Начинаещ",
        "experienced": "Напреднал",
        "business": "Бизнес",
    }

    for item in EducationItem.objects.all():
        formatted = item.start_date.strftime("%d.%m.%Y")
        item.start_date_ru = formatted
        item.start_date_bg = formatted
        item.level_label_ru = ru_level.get(item.level, item.level)
        item.level_label_bg = bg_level.get(item.level, item.level)
        item.save(update_fields=["start_date_ru", "start_date_bg", "level_label_ru", "level_label_bg"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0005_refactor_blog_editor_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="educationitem",
            name="start_date",
            field=models.DateField(default=date.today),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="educationitem",
            name="external_id",
            field=models.CharField(default=content.models.generate_education_external_id, editable=False, max_length=32, unique=True),
        ),
        migrations.RunPython(forwards, backwards),
        migrations.RemoveField(
            model_name="educationitem",
            name="start_date_ru",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="start_date_bg",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="level_label_ru",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="level_label_bg",
        ),
    ]