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
  Client,
  FreeworksApi,
  Project,
  ProjectResponse
} from '../../../core/services/freeworks-api';


@Component({
  selector: 'app-client-list',

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {

  private readonly api =
    inject(FreeworksApi);


  clients =
    signal<Client[]>([]);

  projects =
    signal<Project[]>([]);

  loading =
    signal(true);

  error =
    signal(false);

  search = '';


  ngOnInit(): void {
    this.loadProjects();
    this.loadClients();
  }


  loadProjects(): void {
    this.api.getProjects().subscribe({

      next: (
        data: Project[] | ProjectResponse
      ) => {

        if (Array.isArray(data)) {
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


  loadClients(): void {

    this.loading.set(true);
    this.error.set(false);

    this.api.getClients().subscribe({

      next: (data) => {

        let result =
          [...data];

        if (this.search.trim()) {

          const term =
            this.search
              .trim()
              .toLowerCase();

          result =
            result.filter(
              client =>

                client.name
                  .toLowerCase()
                  .includes(term)

                ||

                client.email
                  .toLowerCase()
                  .includes(term)

                ||

                client.company
                  .toLowerCase()
                  .includes(term)

            );
        }

        this.clients.set(result);
        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'ERROR CLIENTES:',
          error
        );

        this.error.set(true);
        this.loading.set(false);
      }

    });
  }


  clearSearch(): void {
    this.search = '';
    this.loadClients();
  }


  projectCount(
    clientId: number
  ): number {

    return this.projects().filter(
      project =>
        project.client === clientId
    ).length;

  }

}