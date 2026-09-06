from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone

from .models import Client, Project, Deliverable, Comment
from .serializers import (
    ClientSerializer,
    ProjectSerializer,
    DeliverableSerializer,
    CommentSerializer
)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by('name')
    serializer_class = ClientSerializer

    filter_backends = [
        SearchFilter,
        OrderingFilter
    ]

    search_fields = [
        'name',
        'email',
        'company'
    ]

    ordering_fields = [
        'name',
        'company'
    ]


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    filter_backends = [
        SearchFilter,
        OrderingFilter
    ]

    search_fields = [
        'name',
        'description',
        'client__name',
        'client__company',
        'deliverables__name',
        'deliverables__description'
    ]

    ordering_fields = [
        'name',
        'deadline',
        'start_date',
        'priority',
        'created_at'
    ]

    def get_queryset(self):
        queryset = Project.objects.select_related(
            'client'
        ).prefetch_related(
            'deliverables',
            'comments'
        ).all()

        client = self.request.query_params.get('client')
        status = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')

        if client:
            queryset = queryset.filter(client_id=client)

        if status:
            if status == 'late':
                from django.utils import timezone

                queryset = queryset.filter(
                    deadline__lt=timezone.now().date()
                ).exclude(
                    status='completed'
                )
            else:
                queryset = queryset.filter(status=status)

        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset.distinct()


class DeliverableViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverableSerializer

    filter_backends = [
        SearchFilter,
        OrderingFilter
    ]

    search_fields = [
        'name',
        'description',
        'project__name'
    ]

    ordering_fields = [
        'delivery_date',
        'created_at',
        'name'
    ]

    def get_queryset(self):
        queryset = Deliverable.objects.select_related(
            'project'
        ).all()

        project = self.request.query_params.get('project')
        status = self.request.query_params.get('status')

        if project:
            queryset = queryset.filter(project_id=project)

        if status:
            queryset = queryset.filter(status=status)

        return queryset


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.select_related(
            'project',
            'client'
        ).all().order_by('-created_at')

        project = self.request.query_params.get('project')

        if project:
            queryset = queryset.filter(project_id=project)

        return queryset
@api_view(['GET'])
def dashboard_summary(request):
    projects = Project.objects.all()
    deliverables = Deliverable.objects.all()

    total_projects = projects.count()
    completed = projects.filter(status='completed').count()
    pending = projects.filter(status='pending').count()

    late = sum(
        1 for project in projects
        if project.current_status == 'late'
    )

    in_progress = sum(
        1 for project in projects
        if project.current_status == 'progress'
    )

    total_deliverables = deliverables.count()
    delivered = deliverables.filter(
        status='delivered'
    ).count()

    overall_progress = 0

    if total_deliverables > 0:
        overall_progress = round(
            (delivered / total_deliverables) * 100
        )

    return Response({
        'total_projects': total_projects,
        'in_progress': in_progress,
        'completed': completed,
        'pending': pending,
        'late': late,
        'total_deliverables': total_deliverables,
        'delivered': delivered,
        'overall_progress': overall_progress,
    })


@api_view(['GET'])
def notifications(request):
    today = timezone.now().date()

    notifications_list = []

    for project in Project.objects.all():

        if project.is_overdue:
            notifications_list.append({
                'type': 'danger',
                'title': 'Proyecto atrasado',
                'message': (
                    f'{project.name} superó su fecha límite.'
                ),
                'project_id': project.id,
                'date': project.deadline,
            })

    for deliverable in Deliverable.objects.select_related('project'):

        if deliverable.is_overdue:
            notifications_list.append({
                'type': 'danger',
                'title': 'Entrega atrasada',
                'message': (
                    f'{deliverable.name} de '
                    f'{deliverable.project.name} está atrasado.'
                ),
                'project_id': deliverable.project_id,
                'date': deliverable.delivery_date,
            })

        elif (
            deliverable.status == 'pending'
            and today <= deliverable.delivery_date <= today + timedelta(days=3)
        ):
            days = (deliverable.delivery_date - today).days

            notifications_list.append({
                'type': 'warning',
                'title': 'Entrega próxima',
                'message': (
                    f'{deliverable.name} vence '
                    f'en {days} día(s).'
                ),
                'project_id': deliverable.project_id,
                'date': deliverable.delivery_date,
            })

    notifications_list.sort(
        key=lambda item: item['date']
    )

    return Response({
        'count': len(notifications_list),
        'notifications': notifications_list,
    })
