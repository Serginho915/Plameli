from django.db import migrations, models


def forwards(apps, schema_editor):
    BlogPost = apps.get_model("content", "BlogPost")
    EducationItem = apps.get_model("content", "EducationItem")

    for post in BlogPost.objects.all():
        post.date_label = post.date_label_ru or post.date_label_bg or ""
        post.save(update_fields=["date_label"])

    for item in EducationItem.objects.all():
        if item.item_type == "webinar":
            item.image_src = item.poster or ""
            item.video_src = item.media_src or ""
        else:
            item.image_src = item.media_src or ""
            item.video_src = ""
        item.save(update_fields=["image_src", "video_src"])


def backwards(apps, schema_editor):
    BlogPost = apps.get_model("content", "BlogPost")
    EducationItem = apps.get_model("content", "EducationItem")

    for post in BlogPost.objects.all():
        post.date_label_ru = post.date_label or ""
        post.date_label_bg = post.date_label or ""
        post.save(update_fields=["date_label_ru", "date_label_bg"])

    for item in EducationItem.objects.all():
        if item.item_type == "webinar":
            item.poster = item.image_src or ""
            item.media_src = item.video_src or ""
        else:
            item.poster = ""
            item.media_src = item.image_src or ""
        item.save(update_fields=["poster", "media_src"])


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0003_delete_contentpage"),
    ]

    operations = [
        migrations.AddField(
            model_name="blogpost",
            name="date_label",
            field=models.CharField(default="", max_length=120),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="educationitem",
            name="image_src",
            field=models.CharField(blank=True, default="", max_length=500),
        ),
        migrations.AddField(
            model_name="educationitem",
            name="video_src",
            field=models.CharField(blank=True, default="", max_length=500),
        ),
        migrations.RunPython(forwards, backwards),
        migrations.RemoveField(
            model_name="blogpost",
            name="date_label_bg",
        ),
        migrations.RemoveField(
            model_name="blogpost",
            name="date_label_ru",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="media_src",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="poster",
        ),
    ]