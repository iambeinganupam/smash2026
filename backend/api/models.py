from django.db import models
from django.contrib.auth.models import User

class Goal(models.Model):
    GOAL_TYPES = [
        ('long-term', 'Long Term'),
        ('short-term', 'Short Term'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=GOAL_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type}: {self.title}"

class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')
    text = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text

class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    content = models.TextField()
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}"
