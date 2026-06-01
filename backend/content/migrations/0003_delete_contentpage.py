from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0002_remove_english_fields"),
    ]

    operations = [
        migrations.DeleteModel(
            name="ContentPage",
        ),
    ]