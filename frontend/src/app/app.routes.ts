import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';

import { ProjectList } from './features/projects/project-list/project-list';
import { ProjectForm } from './features/projects/project-form/project-form';
import { ProjectDetail } from './features/projects/project-detail/project-detail';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'projects',
        component: ProjectList
      },

      {
        path: 'projects/new',
        component: ProjectForm
      },

      {
        path: 'projects/:id/edit',
        component: ProjectForm
      },

      {
        path: 'projects/:id',
        component: ProjectDetail
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];