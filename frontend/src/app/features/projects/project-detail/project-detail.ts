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
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  FreeworksApi,
  Project
} from '../../../core/services/freeworks-api';


@Component({
  selector: 'app-project-detail',

  imports: [
    CommonModule,
    FormsModule
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

  savingComment =
    signal(false);

  commentError =
    signal('');

  commentMessage = '';


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


  addComment(): void {

    this.commentError.set('');


    const project =
      this.project();


    if (!project) {
      return;
    }


    const message =
      this.commentMessage.trim();


    if (!message) {

      this.commentError.set(
        'Escribe un comentario antes de guardar.'
      );

      return;

    }


    if (message.length < 3) {

      this.commentError.set(
        'El comentario debe tener al menos 3 caracteres.'
      );

      return;

    }


    this.savingComment.set(true);


    this.api.createComment({

      project:
        project.id,

      client:
        project.client,

      message:
        message

    }).subscribe({

      next: () => {

        this.commentMessage = '';

        this.savingComment.set(false);

        this.loadProject(
          project.id
        );

      },


      error: (error) => {

        console.error(
          'ERROR COMENTARIO:',
          error
        );

        this.commentError.set(
          'No fue posible guardar el comentario.'
        );

        this.savingComment.set(false);

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