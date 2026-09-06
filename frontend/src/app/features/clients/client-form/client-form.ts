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
  ClientPayload,
  FreeworksApi
} from '../../../core/services/freeworks-api';


@Component({
  selector: 'app-client-form',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm implements OnInit {

  private readonly api =
    inject(FreeworksApi);

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  loading =
    signal(false);

  saving =
    signal(false);

  errorMessage =
    signal('');


  clientId:
    number | null = null;

  isEditMode =
    false;


  form =
    this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      company: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

    });


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get(
        'id'
      );

    if (id) {

      this.clientId =
        Number(id);

      this.isEditMode =
        true;

      this.loadClient(
        this.clientId
      );

    }

  }


  loadClient(
    id: number
  ): void {

    this.loading.set(true);


    this.api.getClient(id).subscribe({

      next: (client) => {

        this.form.patchValue({

          name:
            client.name,

          company:
            client.company,

          email:
            client.email

        });


        this.loading.set(false);

      },


      error: () => {

        this.errorMessage.set(
          'No fue posible cargar el cliente.'
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
        'Revisa los campos antes de continuar.'
      );

      return;

    }


    const values =
      this.form.getRawValue();


    const payload:
      ClientPayload = {

      name:
        values.name!,

      company:
        values.company!,

      email:
        values.email!

    };


    this.saving.set(true);


    if (
      this.isEditMode
      &&
      this.clientId
    ) {

      this.api.updateClient(
        this.clientId,
        payload
      ).subscribe({

        next: () => {

          this.saving.set(false);

          this.router.navigate([
            '/clients'
          ]);

        },


        error: (error) => {

          this.handleError(
            error
          );

        }

      });


      return;

    }


    this.api.createClient(
      payload
    ).subscribe({

      next: () => {

        this.saving.set(false);

        this.router.navigate([
          '/clients'
        ]);

      },


      error: (error) => {

        this.handleError(
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


  private handleError(
    error: any
  ): void {

    console.error(
      'ERROR CLIENTE:',
      error
    );


    this.saving.set(false);


    if (
      error?.error?.email
    ) {

      this.errorMessage.set(
        error.error.email[0]
      );

      return;

    }


    this.errorMessage.set(
      'No fue posible guardar el cliente.'
    );

  }

}