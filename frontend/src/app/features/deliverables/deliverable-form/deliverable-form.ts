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
  DeliverablePayload,
  FreeworksApi,
  Project,
  ProjectResponse
} from '../../../core/services/freeworks-api';


@Component({
  selector: 'app-deliverable-form',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './deliverable-form.html',
  styleUrl: './deliverable-form.css'
})
export class DeliverableForm implements OnInit {

  private readonly api =
    inject(FreeworksApi);

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  projects =
    signal<Project[]>([]);

  loading =
    signal(false);

  saving =
    signal(false);

  errorMessage =
    signal('');


  deliverableId:
    number | null = null;

  isEditMode =
    false;


  form =
    this.fb.group({

      project: [
        '',
        Validators.required
      ],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],

      delivery_date: [
        '',
        Validators.required
      ],

      simulated_file: [
        ''
      ],

      status: [
        'pending',
        Validators.required
      ]

    });


  ngOnInit(): void {

    this.loadProjects();


    const id =
      this.route.snapshot.paramMap.get(
        'id'
      );


    const projectId =
      this.route.snapshot.queryParamMap.get(
        'project'
      );


    if (projectId) {

      this.form.patchValue({
        project:
          projectId
      });

    }


    if (id) {

      this.deliverableId =
        Number(id);

      this.isEditMode =
        true;

      this.loadDeliverable(
        this.deliverableId
      );

    }

  }


  loadProjects(): void {

    this.api.getProjects().subscribe({

      next: (
        data: Project[] | ProjectResponse
      ) => {

        if (
          Array.isArray(data)
        ) {

          this.projects.set(data);

        } else {

          this.projects.set(
            data.results ?? []
          );

        }

      },

      error: () => {

        this.errorMessage.set(
          'No fue posible cargar los proyectos.'
        );

      }

    });

  }


  loadDeliverable(
    id: number
  ): void {

    this.loading.set(true);


    this.api.getDeliverable(id).subscribe({

      next: (deliverable) => {

        this.form.patchValue({

          project:
            String(
              deliverable.project
            ),

          name:
            deliverable.name,

          description:
            deliverable.description,

          delivery_date:
            deliverable.delivery_date,

          simulated_file:
            deliverable.simulated_file,

          status:
            deliverable.status

        });


        this.loading.set(false);

      },


      error: () => {

        this.errorMessage.set(
          'No fue posible cargar el entregable.'
        );

        this.loading.set(false);

      }

    });

  }


  submit(): void {

    this.errorMessage.set('');


    if (
      this.form.invalid
    ) {

      this.form.markAllAsTouched();

      this.errorMessage.set(
        'Revisa los campos antes de continuar.'
      );

      return;

    }


    const values =
      this.form.getRawValue();


    const selectedProject =
      this.projects().find(
        project =>
          project.id ===
          Number(
            values.project
          )
      );


    if (
      selectedProject
      &&
      values.delivery_date
      &&
      values.delivery_date <
        selectedProject.start_date
    ) {

      this.errorMessage.set(
        'La fecha de entrega no puede ser anterior al inicio del proyecto.'
      );

      return;

    }


    const payload:
      DeliverablePayload = {

      project:
        Number(
          values.project
        ),

      name:
        values.name!,

      description:
        values.description!,

      delivery_date:
        values.delivery_date!,

      simulated_file:
        values.simulated_file
        ?? '',

      status:
        values.status!

    };


    this.saving.set(true);


    if (
      this.isEditMode
      &&
      this.deliverableId
    ) {

      this.api.updateDeliverable(
        this.deliverableId,
        payload
      ).subscribe({

        next: () => {

          this.saving.set(false);

          this.router.navigate([
            '/deliverables'
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


    this.api.createDeliverable(
      payload
    ).subscribe({

      next: () => {

        this.saving.set(false);

        this.router.navigate([
          '/deliverables'
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
      &&
      control.invalid
      &&
      control.touched
    );

  }


  private handleApiError(
    error: any
  ): void {

    console.error(
      'ERROR ENTREGABLE:',
      error
    );


    this.saving.set(false);


    if (
      error?.error?.delivery_date
    ) {

      this.errorMessage.set(
        error.error.delivery_date[0]
      );

      return;

    }


    this.errorMessage.set(
      'No fue posible guardar el entregable.'
    );

  }

}