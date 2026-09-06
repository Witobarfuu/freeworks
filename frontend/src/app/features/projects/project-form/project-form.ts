import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  Client,
  FreeworksApi,
  ProjectPayload
} from '../../../core/services/freeworks-api';


@Component({
  selector: 'app-project-form',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm implements OnInit {

  private readonly api =
    inject(FreeworksApi);

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  clients =
    signal<Client[]>([]);

  loading =
    signal(false);

  saving =
    signal(false);

  errorMessage =
    signal('');

  projectId:
    number | null = null;

  isEditMode = false;


  form = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    client: [
      '',
      Validators.required
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10)
      ]
    ],

    start_date: [
      '',
      Validators.required
    ],

    deadline: [
      '',
      Validators.required
    ],

    priority: [
      'medium',
      Validators.required
    ],

    status: [
      'pending',
      Validators.required
    ],

    manual_progress: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]
    ]

  });


  ngOnInit(): void {

    this.loadClients();

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.projectId =
        Number(id);

      this.isEditMode =
        true;

      this.loadProject(
        this.projectId
      );

    }

  }


  loadClients(): void {

    this.api.getClients().subscribe({

      next: (data) => {

        this.clients.set(data);

      },

      error: (error) => {

        console.error(
          'ERROR CLIENTES:',
          error
        );

        this.errorMessage.set(
          'No fue posible cargar los clientes.'
        );

      }

    });

  }


  loadProject(
    id: number
  ): void {

    this.loading.set(true);

    this.api.getProject(id).subscribe({

      next: (project) => {

        this.form.patchValue({

          name:
            project.name,

          client:
            String(project.client),

          description:
            project.description,

          start_date:
            project.start_date,

          deadline:
            project.deadline,

          priority:
            project.priority,

          status:
            project.status,

          manual_progress:
            project.manual_progress

        });

        this.loading.set(false);

      },

      error: (error) => {

        console.error(
          'ERROR PROYECTO:',
          error
        );

        this.errorMessage.set(
          'No fue posible cargar el proyecto.'
        );

        this.loading.set(false);

      }

    });

  }


  submit(): void {

    this.errorMessage.set('');

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      this.errorMessage.set(
        'Revisa los campos marcados antes de continuar.'
      );

      return;

    }


    const values =
      this.form.getRawValue();


    if (
      values.start_date
      && values.deadline
      && values.deadline < values.start_date
    ) {

      this.errorMessage.set(
        'La fecha límite no puede ser anterior a la fecha de inicio.'
      );

      return;

    }


    const payload:
      ProjectPayload = {

      name:
        values.name!,

      client:
        Number(values.client),

      description:
        values.description!,

      start_date:
        values.start_date!,

      deadline:
        values.deadline!,

      priority:
        values.priority!,

      status:
        values.status!,

      manual_progress:
        Number(values.manual_progress)

    };


    this.saving.set(true);


    if (
      this.isEditMode
      && this.projectId
    ) {

      this.api.updateProject(
        this.projectId,
        payload
      ).subscribe({

        next: (project) => {

          this.saving.set(false);

          this.router.navigate([
            '/projects',
            project.id
          ]);

        },

        error: (error) => {

          this.handleApiError(
            error
          );

        }

      });

      return;

    }


    this.api.createProject(
      payload
    ).subscribe({

      next: (project) => {

        this.saving.set(false);

        this.router.navigate([
          '/projects',
          project.id
        ]);

      },

      error: (error) => {

        this.handleApiError(
          error
        );

      }

    });

  }


  fieldInvalid(
    field: string
  ): boolean {

    const control =
      this.form.get(field);

    return !!(
      control
      && control.invalid
      && control.touched
    );

  }


  private handleApiError(
    error: any
  ): void {

    console.error(
      'ERROR API:',
      error
    );

    this.saving.set(false);


    if (
      error?.error?.deadline
    ) {

      this.errorMessage.set(
        error.error.deadline[0]
      );

      return;

    }


    if (
      error?.error?.manual_progress
    ) {

      this.errorMessage.set(
        error.error.manual_progress[0]
      );

      return;

    }


    if (
      error?.error?.name
    ) {

      this.errorMessage.set(
        error.error.name[0]
      );

      return;

    }


    this.errorMessage.set(
      'No fue posible guardar el proyecto. Revisa los datos e inténtalo nuevamente.'
    );

  }

}