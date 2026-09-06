import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  total_projects: number;
  in_progress: number;
  completed: number;
  pending: number;
  late: number;
  total_deliverables: number;
  delivered: number;
  overall_progress: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
}

export interface Deliverable {
  id: number;
  project: number;
  name: string;
  description: string;
  delivery_date: string;
  simulated_file: string;
  status: string;
  created_at: string;
  is_overdue: boolean;
}

export interface Comment {
  id: number;
  project: number;
  client: number;
  client_name: string;
  message: string;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;

  client: number;
  client_name: string;

  start_date: string;
  deadline: string;

  status: string;
  current_status: string;

  priority: string;

  manual_progress: number;
  calculated_progress: number;

  is_overdue: boolean;

  created_at: string;
  updated_at: string;

  deliverables: Deliverable[];
  comments: Comment[];
}

export interface ProjectResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Project[];
}

export interface NotificationItem {
  type: string;
  title: string;
  message: string;
  project_id: number;
  date: string;
}

export interface NotificationResponse {
  count: number;
  notifications: NotificationItem[];
}

@Injectable({
  providedIn: 'root'
})
export class FreeworksApi {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://127.0.0.1:8000/api';

  getDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.apiUrl}/dashboard/`
    );
  }

  getProjects(): Observable<Project[] | ProjectResponse> {
    return this.http.get<Project[] | ProjectResponse>(
      `${this.apiUrl}/projects/`
    );
  }

  getNotifications(): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(
      `${this.apiUrl}/notifications/`
    );
  }
getClients(): Observable<Client[]> {
  return this.http.get<Client[]>(
    `${this.apiUrl}/clients/`
  );
}

getProjectsFiltered(params: {
  search?: string;
  client?: string;
  status?: string;
  priority?: string;
}): Observable<Project[] | ProjectResponse> {

  const query = new URLSearchParams();

  if (params.search) {
    query.set('search', params.search);
  }

  if (params.client) {
    query.set('client', params.client);
  }

  if (params.status) {
    query.set('status', params.status);
  }

  if (params.priority) {
    query.set('priority', params.priority);
  }

  const suffix =
    query.toString()
      ? `?${query.toString()}`
      : '';

  return this.http.get<Project[] | ProjectResponse>(
    `${this.apiUrl}/projects/${suffix}`
  );
}
}