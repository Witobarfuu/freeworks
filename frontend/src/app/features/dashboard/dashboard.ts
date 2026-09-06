import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  DashboardSummary,
  FreeworksApi,
  Project,
  ProjectResponse
} from '../../core/services/freeworks-api';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly api = inject(FreeworksApi);

  summary = signal<DashboardSummary | null>(null);
  projects = signal<Project[]>([]);

  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.loadDashboard();
    this.loadProjects();
  }

  private loadDashboard(): void {
    this.api.getDashboard().subscribe({
      next: (data) => {
        console.log('DASHBOARD:', data);

        this.summary.set(data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('ERROR DASHBOARD:', error);

        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private loadProjects(): void {
    this.api.getProjects().subscribe({
      next: (data: Project[] | ProjectResponse) => {

        console.log('PROYECTOS:', data);

        if (Array.isArray(data)) {
          this.projects.set(
            data.slice(0, 4)
          );
        } else {
          this.projects.set(
            (data.results ?? []).slice(0, 4)
          );
        }
      },

      error: (error) => {
        console.error('ERROR PROYECTOS:', error);
        this.error.set(true);
      }
    });
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