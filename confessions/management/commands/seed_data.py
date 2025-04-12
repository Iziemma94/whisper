from django.core.management.base import BaseCommand
from confessions.models import Category, Confession, Comment
from faker import Faker
import random

class Command(BaseCommand):
    help = 'Seeds the database with dummy categories, confessions, and comments'

    def handle(self, *args, **kwargs):
        fake = Faker()

        category_names = ['Love', 'Hate', 'Secrets', 'Regret', 'Funny']
        for name in category_names:
            Category.objects.get_or_create(name=name)

        categories = list(Category.objects.all())

        NUM_CONFESSIONS = 20
        for _ in range(NUM_CONFESSIONS):
            confession = Confession.objects.create(
                title=fake.sentence(nb_words=6),
                body=fake.paragraph(nb_sentences=5),
                category=random.choice(categories)
            )

            # Add comments
            for _ in range(random.randint(2, 5)):
                Comment.objects.create(
                    confession=confession,
                    body=random.choice([
                        fake.sentence() + " 😂",
                        fake.sentence() + " 💔",
                        fake.sentence() + " 😳",
                        fake.sentence() + " 🤫",
                    ]),
                    likes=random.randint(0, 10),
                    is_nsfw=random.choice([False, True]),
                    is_anonymous=random.choice([False, True])
                )

        self.stdout.write(self.style.SUCCESS("✅ Dummy confessions & comments created!"))



