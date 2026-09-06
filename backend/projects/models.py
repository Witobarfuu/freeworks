from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class Client(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    company = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('progress', 'En progreso'),
        ('completed', 'Finalizado'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
    ]

    name = models.CharField(max_length=150)
    description = models.TextField()

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='projects'
    )

    start_date = models.DateField()
    deadline = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='medium'
    )

    manual_progress = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.deadline < self.start_date:
            raise ValidationError(
                'La fecha límite no puede ser anterior a la fecha de inicio.'
            )

        if self.manual_progress > 100:
            raise ValidationError(
                'El progreso manual debe estar entre 0 y 100.'
            )

    @property
    def calculated_progress(self):
        total = self.deliverables.count()

        if total == 0:
            return self.manual_progress

        delivered = self.deliverables.filter(
            status='delivered'
        ).count()

        return round((delivered / total) * 100)

    @property
    def current_status(self):
        if self.status == 'completed':
            return 'completed'

        if self.deadline < timezone.now().date():
            return 'late'

        return self.status

    @property
    def is_overdue(self):
        return (
            self.deadline < timezone.now().date()
            and self.status != 'completed'
        )

    def __str__(self):
        return self.name


class Deliverable(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('delivered', 'Entregado'),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='deliverables'
    )

    name = models.CharField(max_length=150)
    description = models.TextField()

    delivery_date = models.DateField()

    simulated_file = models.CharField(
        max_length=255,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_overdue(self):
        return (
            self.delivery_date < timezone.now().date()
            and self.status != 'delivered'
        )

    def __str__(self):
        return self.name


class Comment(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.project.client_id != self.client_id:
            raise ValidationError(
                'El comentario debe pertenecer al cliente asociado al proyecto.'
            )

    def __str__(self):
        return f'{self.client.name} - {self.project.name}'