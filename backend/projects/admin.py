from django.contrib import admin
from .models import Client, Project, Deliverable, Comment


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company')
    search_fields = ('name', 'email', 'company')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'client',
        'status',
        'priority',
        'deadline',
        'progress_display',
    )

    list_filter = (
        'status',
        'priority',
        'client',
    )

    search_fields = (
        'name',
        'description',
        'client__name',
        'client__company',
    )

    def progress_display(self, obj):
        return f'{obj.calculated_progress}%'

    progress_display.short_description = 'Progreso'


@admin.register(Deliverable)
class DeliverableAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'project',
        'status',
        'delivery_date',
        'overdue_display',
    )

    list_filter = (
        'status',
        'delivery_date',
    )

    search_fields = (
        'name',
        'description',
        'project__name',
    )

    def overdue_display(self, obj):
        return 'Sí' if obj.is_overdue else 'No'

    overdue_display.short_description = 'Atrasado'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        'project',
        'client',
        'created_at',
    )

    search_fields = (
        'project__name',
        'client__name',
        'message',
    )