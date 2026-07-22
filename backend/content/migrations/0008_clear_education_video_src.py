from django.db import migrations


def clear_video_src(apps, schema_editor):
    EducationItem = apps.get_model("content", "EducationItem")
    EducationItem.objects.exclude(video_src="").update(video_src="")


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0007_refactor_education_price_goal_format_labels"),
    ]

    operations = [
        migrations.RunPython(clear_video_src, noop_reverse),
    ]
