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

    def validate(self, data):
        project = data.get(
            'project',
            getattr(self.instance, 'project', None)
        )

        delivery_date = data.get(
            'delivery_date',
            getattr(self.instance, 'delivery_date', None)
        )

        if (
            project
            and delivery_date
            and delivery_date < project.start_date
        ):
            raise serializers.ValidationError({
                'delivery_date':
                    'La fecha del entregable no puede ser anterior al inicio del proyecto.'
            })

        return data


class CommentSerializer(serializers.ModelSerializer):

    client_name = serializers.CharField(
        source='client.name',
        read_only=True
    )

    class Meta:
        model = Comment
        fields = '__all__'

    def validate(self, data):
        project = data.get(
            'project',
            getattr(self.instance, 'project', None)
        )

        client = data.get(
            'client',
            getattr(self.instance, 'client', None)
        )

        if (
            project
            and client
            and project.client_id != client.id
        ):
            raise serializers.ValidationError({
                'client':
                    'El comentario debe pertenecer al cliente asociado al proyecto.'
            })

        return data


class ProjectSerializer(serializers.ModelSerializer):

    client_name = serializers.CharField(
        source='client.name',
        read_only=True
    )

    client_company = serializers.CharField(
        source='client.company',
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

    def validate(self, data):

        start_date = data.get(
            'start_date',
            getattr(self.instance, 'start_date', None)
        )

        deadline = data.get(
            'deadline',
            getattr(self.instance, 'deadline', None)
        )

        manual_progress = data.get(
            'manual_progress',
            getattr(self.instance, 'manual_progress', 0)
        )

        if (
            start_date
            and deadline
            and deadline < start_date
        ):
            raise serializers.ValidationError({
                'deadline':
                    'La fecha límite no puede ser anterior a la fecha de inicio.'
            })

        if manual_progress < 0 or manual_progress > 100:
            raise serializers.ValidationError({
                'manual_progress':
                    'El progreso debe estar entre 0 y 100.'
            })

        return data