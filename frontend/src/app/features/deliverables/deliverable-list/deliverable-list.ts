import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

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
  selector: 'app-deliverable-list',

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './deliverable-list.html',
  styleUrl: './deliverable-list.css'
})
export class DeliverableList implements OnInit {

  private readonly api =
    inject(FreeworksApi);


  deliverables =
    signal<Deliverable[]>([]);

  projects =
    signal<Project[]>([]);


  loading =
    signal(true);

  error =
    signal(false);


  search = '';

  selectedProject = '';

  selectedStatus = '';


  ngOnInit(): void {

    this.loadProjects();

    this.loadDeliverables();

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

      error: (error) => {

        console.error(
          'ERROR PROYECTOS:',
          error
        );

      }

    });

  }


  loadDeliverables(): void {

    this.loading.set(true);

    this.error.set(false);


    this.api.getDeliverables().subscribe({

      next: (data) => {

        let result =
          [...data];


        if (
          this.selectedProject
        ) {

          result =
            result.filter(
              deliverable =>
                deliverable.project ===
                Number(
                  this.selectedProject
                )
            );

        }


        if (
          this.selectedStatus
        ) {

          result =
            result.filter(
              deliverable =>
                deliverable.status ===
                this.selectedStatus
            );

        }


        if (
          this.search.trim()
        ) {

          const term =
            this.search
              .trim()
              .toLowerCase();


          result =
            result.filter(
              deliverable =>

                deliverable.name
                  .toLowerCase()
                  .includes(term)

                ||

                deliverable.description
                  .toLowerCase()
                  .includes(term)

                ||

                this.projectName(
                  deliverable.project
                )
                  .toLowerCase()
                  .includes(term)

            );

        }


        this.deliverables.set(
          result
        );


        this.loading.set(false);

      },


      error: (error) => {

        console.error(
          'ERROR ENTREGABLES:',
          error
        );

        this.error.set(true);

        this.loading.set(false);

      }

    });

  }


  clearFilters(): void {

    this.search = '';

    this.selectedProject = '';

    this.selectedStatus = '';

    this.loadDeliverables();

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


  statusLabel(
    status: string
  ): string {

    return (
      status === 'delivered'
        ? 'Entregado'
        : 'Pendiente'
    );

  }

}