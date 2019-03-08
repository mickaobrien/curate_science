# Generated by Django 2.1.7 on 2019-03-07 04:49

import autoslug.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('curate', '0038_auto_20190226_0426'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='is_live',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='article',
            name='author_contributions',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='article',
            name='competing_interests',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='article',
            name='funding_sources',
            field=models.TextField(blank=True, max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='author',
            name='slug',
            field=autoslug.fields.AutoSlugField(editable=True, null=True, populate_from='name', unique=True),
        ),
    ]
