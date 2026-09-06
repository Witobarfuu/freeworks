import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  Deliverable,
  FreeworksApi,
  Project,
  ProjectResponse
} from '../../../core/services/freeworks-api';


@Component({
  selector: 'app-alert-list',

  imports: [
    RouterLink
  ],

  templateUrl: './alert-list.html',
  styleUrl: './alert-list.css'
})
export class AlertList implements OnInit {

  private readonly api =
    inject(FreeworksApi);


  overdueProjects =
    signal<Project[]>([]);

  overdueDeliverables =
    signal<Deliverable[]>([]);

  projects =
    signal<Project[]>([]);

  loading =
    signal(true);

  error =
    signal(false);


  ngOnInit(): void {

    this.loadData();

  }


  loadData(): void {

    this.loading.set(true);

    this.error.set(false);


    this.api.getProjects().subscribe({

      next: (
        data: Project[] | ProjectResponse
      ) => {

        const projects =
          Array.isArray(data)
            ? data
            : data.results ?? [];


        this.projects.set(
          projects
        );


        this.overdueProjects.set(
          projects.filter(
            project =>
              project.is_overdue
          )
        );


        this.loadDeliverables();

      },


      error: (error) => {

        console.error(
          'ERROR ALERTAS PROYECTOS:',
          error
        );

        this.error.set(true);

        this.loading.set(false);

      }

    });

  }


  private loadDeliverables(): void {

    this.api.getDeliverables().subscribe({

      next: (deliverables) => {

        this.overdueDeliverables.set(
          deliverables.filter(
            deliverable =>
              deliverable.is_overdue
          )
        );


        this.loading.set(false);

      },


      error: (error) => {

        console.error(
          'ERROR ALERTAS ENTREGABLES:',
          error
        );

        this.error.set(true);

        this.loading.set(false);

      }

    });

  }


  projectName(
    projectId: number
  ): string {

    return (
      this.projects().find(
        project =>
          project.id === projectId
      )?.name
      ?? 'Proyecto'
    );

  }


  totalAlerts(): number {

    return (
      this.overdueProjects().length
      +
      this.overdueDeliverables().length
    );

  }

}