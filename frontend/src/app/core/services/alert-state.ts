import {
  Injectable,
  inject,
  signal
} from '@angular/core';

import {
  FreeworksApi,
  Project,
  ProjectResponse
} from './freeworks-api';


@Injectable({
  providedIn: 'root'
})
export class AlertState {

  private readonly api =
    inject(FreeworksApi);

  count =
    signal(0);

  loading =
    signal(false);


  refresh(): void {

    this.loading.set(true);

    this.api.getProjects().subscribe({

      next: (
        data: Project[] | ProjectResponse
      ) => {

        const projects =
          Array.isArray(data)
            ? data
            : data.results ?? [];

        const overdueProjects =
          projects.filter(
            project =>
              project.is_overdue
          ).length;


        this.api.getDeliverables().subscribe({

          next: (deliverables) => {

            const overdueDeliverables =
              deliverables.filter(
                deliverable =>
                  deliverable.is_overdue
              ).length;


            this.count.set(
              overdueProjects
              +
              overdueDeliverables
            );

            this.loading.set(false);

          },


          error: (error) => {

            console.error(
              'ERROR ALERTAS ENTREGABLES:',
              error
            );

            this.loading.set(false);

          }

        });

      },


      error: (error) => {

        console.error(
          'ERROR ALERTAS PROYECTOS:',
          error
        );

        this.loading.set(false);

      }

    });

  }

}