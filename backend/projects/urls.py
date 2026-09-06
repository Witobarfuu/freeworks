from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    ClientViewSet,
    ProjectViewSet,
    DeliverableViewSet,
    CommentViewSet,
    dashboard_summary,
    notifications,
)

router = DefaultRouter()

router.register(
    r'clients',
    ClientViewSet,
    basename='clients'
)

router.register(
    r'projects',
    ProjectViewSet,
    basename='projects'
)

router.register(
    r'deliverables',
    DeliverableViewSet,
    basename='deliverables'
)

router.register(
    r'comments',
    CommentViewSet,
    basename='comments'
)

urlpatterns = [
    path('dashboard/', dashboard_summary, name='dashboard'),
    path('notifications/', notifications, name='notifications'),
]

urlpatterns += router.urls