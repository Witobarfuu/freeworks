import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Client,
  FreeworksApi,
  Project,
  ProjectResponse
} from '../../../core/services/freeworks-api';

@Component({
  selector: 'app-project-list',
  imports: [
    FormsModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList implements OnInit {

  private readonly api = inject(FreeworksApi);

  projects = signal<Project[]>([]);
  clients = signal<Client[]>([]);

  loading = signal(true);
  error = signal(false);

  search = '';
  selectedClient = '';
  selectedStatus = '';
  selectedPriority = '';

  ngOnInit(): void {
    this.loadClients();
    this.loadProjects();
  }

  loadClients(): void {
    this.api.getClients().subscribe({
      next: (data) => {
        this.clients.set(data);
      },
      error: () => {
        this.error.set(true);
      }
    });
  }

  loadProjects(): void {

    this.loading.set(true);

    this.api.getProjectsFiltered({
      search: this.search,
      client: this.selectedClient,
      status: this.selectedStatus,
      priority: this.selectedPriority
    }).subscribe({

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

        this.loading.set(false);
      },

      error: (error) => {
        console.error(error);

        this.error.set(true);
        this.loading.set(false);
      }

    });
  }

  clearFilters(): void {
    this.search = '';
    this.selectedClient = '';
    this.selectedStatus = '';
    this.selectedPriority = '';

    this.loadProjects();
  }

  statusLabel(status: string): string {

    const labels: Record<string, string> = {
      pending: 'Pendiente',
      progress: 'En progreso',
      completed: 'Finalizado',
      late: 'Atrasado'
    };

    return labels[status] ?? status;
  }

  priorityLabel(priority: string): string {

    const labels: Record<string, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta'
    };

    return labels[priority] ?? priority;
  }
}