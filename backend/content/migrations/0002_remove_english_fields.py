from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="blogpost",
            name="content_en",
        ),
        migrations.RemoveField(
            model_name="blogpost",
            name="date_label_en",
        ),
        migrations.RemoveField(
            model_name="blogpost",
            name="title_en",
        ),
        migrations.RemoveField(
            model_name="contentpage",
            name="content_en",
        ),
        migrations.RemoveField(
            model_name="contentpage",
            name="title_en",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="description_en",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="format_label_en",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="goal_label_en",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="level_label_en",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="price_en",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="start_date_en",
        ),
        migrations.RemoveField(
            model_name="educationitem",
            name="title_en",
        ),
        migrations.RemoveField(
            model_name="educationmodule",
            name="description_en",
        ),
        migrations.RemoveField(
            model_name="educationmodule",
            name="title_en",
        ),
    ]