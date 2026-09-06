import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  FreeworksApi,
  Project
} from '../../../core/services/freeworks-api';


@Component({
  selector: 'app-project-detail',

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetail implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly api =
    inject(FreeworksApi);


  project =
    signal<Project | null>(null);

  loading =
    signal(true);

  error =
    signal('');


  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );


    if (!id) {

      this.error.set(
        'No se pudo identificar el proyecto.'
      );

      this.loading.set(false);

      return;

    }


    this.loadProject(id);

  }


  loadProject(
    id: number
  ): void {

    this.loading.set(true);

    this.error.set('');


    this.api.getProject(id).subscribe({

      next: (project) => {

        console.log(
          'DETALLE PROYECTO:',
          project
        );

        this.project.set(project);

        this.loading.set(false);

      },


      error: (error) => {

        console.error(
          'ERROR DETALLE PROYECTO:',
          error
        );

        this.error.set(
          'No fue posible cargar la información del proyecto.'
        );

        this.loading.set(false);

      }

    });

  }


  getProgress(): number {

    const project =
      this.project();


    if (!project) {
      return 0;
    }


    return Number(
      project.calculated_progress
      ?? project.manual_progress
      ?? 0
    );

  }


  getStatusLabel(
    status: string
  ): string {

    const statuses:
      Record<string, string> = {

        pending:
          'Pendiente',

        progress:
          'En progreso',

        completed:
          'Finalizado',

        late:
          'Atrasado'

      };


    return (
      statuses[status]
      ?? status
    );

  }


  getPriorityLabel(
    priority: string
  ): string {

    const priorities:
      Record<string, string> = {

        low:
          'Baja',

        medium:
          'Media',

        high:
          'Alta'

      };


    return (
      priorities[priority]
      ?? priority
    );

  }


  editProject(): void {

    const project =
      this.project();


    if (!project) {
      return;
    }


    this.router.navigate([
      '/projects',
      project.id,
      'edit'
    ]);

  }


  goBack(): void {

    this.router.navigate([
      '/projects'
    ]);

  }

}