from django.db import models

# Create your models here.


class TodoList(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.title}'


class Task(models.Model):
    todoList = models.ForeignKey(TodoList, on_delete=models.CASCADE)
    content = models.CharField(max_length=300)
    deadline = models.DateTimeField()
    done = models.BooleanField()

    def __str__(self):
        return f'{self.content} ({self.done})'
