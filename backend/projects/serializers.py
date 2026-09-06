from rest_framework import serializers
from .models import Client, Project, Deliverable, Comment


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class DeliverableSerializer(serializers.ModelSerializer):
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Deliverable
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source='client.name',
        read_only=True
    )

    class Meta:
        model = Comment
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(
        source='client.name',
        read_only=True
    )

    calculated_progress = serializers.ReadOnlyField()
    current_status = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()

    deliverables = DeliverableSerializer(
        many=True,
        read_only=True
    )

    comments = CommentSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Project
        fields = '__all__'