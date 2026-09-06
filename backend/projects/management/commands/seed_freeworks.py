from datetime import date, timedelta

from django.core.management.base import BaseCommand

from projects.models import Client, Project, Deliverable, Comment


class Command(BaseCommand):
    help = 'Carga datos de demostración para FreeWorks'

    def handle(self, *args, **options):
        Comment.objects.all().delete()
        Deliverable.objects.all().delete()
        Project.objects.all().delete()
        Client.objects.all().delete()

        today = date.today()

        techstore = Client.objects.create(
            name='Camila Rojas',
            email='camila@techstore.cl',
            company='TechStore'
        )

        constructora = Client.objects.create(
            name='Felipe Soto',
            email='felipe@constructoranorte.cl',
            company='Constructora Norte'
        )

        studio = Client.objects.create(
            name='Valentina Pérez',
            email='valentina@studiozen.cl',
            company='Studio Zen'
        )

        digital = Client.objects.create(
            name='Matías Herrera',
            email='matias@digitalsolutions.cl',
            company='Digital Solutions'
        )

        ecommerce = Project.objects.create(
            name='Plataforma E-commerce',
            description='Desarrollo de una tienda online moderna con catálogo, carrito y panel administrativo.',
            client=techstore,
            start_date=today - timedelta(days=20),
            deadline=today + timedelta(days=15),
            status='progress',
            priority='high',
            manual_progress=65
        )

        reservas = Project.objects.create(
            name='Sistema de Reservas',
            description='Plataforma web para administrar reservas, horarios y disponibilidad.',
            client=studio,
            start_date=today - timedelta(days=35),
            deadline=today - timedelta(days=3),
            status='progress',
            priority='high',
            manual_progress=50
        )

        corporativo = Project.objects.create(
            name='Sitio Web Corporativo',
            description='Rediseño completo del sitio institucional con enfoque responsive.',
            client=constructora,
            start_date=today - timedelta(days=60),
            deadline=today - timedelta(days=5),
            status='completed',
            priority='medium',
            manual_progress=100
        )

        mobile = Project.objects.create(
            name='Dashboard Analítico',
            description='Panel visual para seguimiento de KPIs y métricas comerciales.',
            client=digital,
            start_date=today - timedelta(days=5),
            deadline=today + timedelta(days=30),
            status='pending',
            priority='medium',
            manual_progress=15
        )

        branding = Project.objects.create(
            name='Landing de Campaña',
            description='Landing page enfocada en conversión y captación de leads.',
            client=techstore,
            start_date=today - timedelta(days=12),
            deadline=today + timedelta(days=7),
            status='progress',
            priority='low',
            manual_progress=40
        )

        Deliverable.objects.create(
            project=ecommerce,
            name='Diseño UI',
            description='Diseño visual aprobado por el cliente.',
            delivery_date=today - timedelta(days=10),
            simulated_file='diseno_ui_final.fig',
            status='delivered'
        )

        Deliverable.objects.create(
            project=ecommerce,
            name='Modelo de datos',
            description='Estructura inicial de productos, clientes y pedidos.',
            delivery_date=today - timedelta(days=5),
            simulated_file='modelo_datos.pdf',
            status='delivered'
        )

        Deliverable.objects.create(
            project=ecommerce,
            name='API REST',
            description='Servicios para catálogo, carrito y pedidos.',
            delivery_date=today + timedelta(days=4),
            simulated_file='api_rest.zip',
            status='pending'
        )

        Deliverable.objects.create(
            project=ecommerce,
            name='Integración final',
            description='Integración frontend y backend.',
            delivery_date=today + timedelta(days=12),
            simulated_file='integracion_final.zip',
            status='pending'
        )

        Deliverable.objects.create(
            project=reservas,
            name='Prototipo navegable',
            description='Prototipo validado por el cliente.',
            delivery_date=today - timedelta(days=15),
            simulated_file='prototipo_reservas.fig',
            status='delivered'
        )

        Deliverable.objects.create(
            project=reservas,
            name='Módulo de calendario',
            description='Gestión de disponibilidad y bloques horarios.',
            delivery_date=today - timedelta(days=2),
            simulated_file='calendario.zip',
            status='pending'
        )

        Deliverable.objects.create(
            project=corporativo,
            name='Sitio final',
            description='Versión final publicada y aprobada.',
            delivery_date=today - timedelta(days=8),
            simulated_file='sitio_final.zip',
            status='delivered'
        )

        Deliverable.objects.create(
            project=mobile,
            name='Wireframes',
            description='Wireframes iniciales del dashboard.',
            delivery_date=today + timedelta(days=8),
            simulated_file='wireframes.pdf',
            status='pending'
        )

        Deliverable.objects.create(
            project=branding,
            name='Copy y estructura',
            description='Contenido y estructura de la landing.',
            delivery_date=today - timedelta(days=1),
            simulated_file='copy_landing.docx',
            status='delivered'
        )

        Deliverable.objects.create(
            project=branding,
            name='Versión responsive',
            description='Ajustes para dispositivos móviles.',
            delivery_date=today + timedelta(days=3),
            simulated_file='responsive.zip',
            status='pending'
        )

        Comment.objects.create(
            project=ecommerce,
            client=techstore,
            message='El diseño se ve muy bien. Favor reforzar la versión móvil.'
        )

        Comment.objects.create(
            project=ecommerce,
            client=techstore,
            message='La navegación del catálogo quedó bastante clara.'
        )

        Comment.objects.create(
            project=reservas,
            client=studio,
            message='Necesitamos que el calendario muestre mejor los bloques ocupados.'
        )

        Comment.objects.create(
            project=corporativo,
            client=constructora,
            message='Proyecto aprobado. Gracias por el resultado final.'
        )

        Comment.objects.create(
            project=branding,
            client=techstore,
            message='La propuesta está alineada con la campaña.'
        )

        self.stdout.write(
            self.style.SUCCESS(
                'Datos de demostración de FreeWorks cargados correctamente.'
            )
        )