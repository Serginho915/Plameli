from django.db import migrations, models


def forwards(apps, schema_editor):
    EducationItem = apps.get_model("content", "EducationItem")

    for item in EducationItem.objects.all():
        item.price = item.price_ru or item.price_bg or ""
        item.save(update_fields=["price"])


def backwards(apps, schema_editor):
    EducationItem = apps.get_model("content", "EducationItem")

    ru_goal = {
        "launch": "Запуск",
        "taxes": "Налоги",
        "profession": "Профессия",
        "optimization": "Оптимизация",
    }
    bg_goal = {
        "launch": "Стартиране",
        "taxes": "Данъци",
        "profession": "Професия",
        "optimization": "Оптимизация",
    }
    ru_format = {
        "online": "Онлайн",
        "live": "Вживую",
        "offline": "Оффлайн",
    }
    bg_format = {
        "online": "Онлайн",
        "live": "На живо",
        "offline": "Офлайн",
    }

    for item in EducationItem.objects.all():
        item.price_ru = item.price
        item.price_bg = item.price
        item.goal_label_ru = ru_goal.get(item.goal, item.goal)
        item.goal_label_bg = bg_goal.get(item.goal, item.goal)
        item.format_label_ru = ru_format.get(item.item_format, item.item_format)
        item.format_label_bg = bg_format.get(item.item_format, item.item_format)
        item.save(
            update_fields=[
                "price_ru",
                "price_bg",
                "goal_label_ru",
                "goal_label_bg",
                "format_label_ru",
                "format_label_bg",
            ]
        )


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0006_refactor_education_start_date_and_level_labels"),
    ]

    operations = [
        migrations.AddField(
            model_name="educationitem",
            name="price",
            field=models.CharField(default="", max_length=120),
            preserve_default=False,
        ),
        migrations.RunPython(forwards, backwards),
        migrations.RemoveField(
            model_name="educationitem",
            name="price_ru",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="price_bg",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="goal_label_ru",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="goal_label_bg",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="format_label_ru",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="format_label_bg",
        ),
    ]