import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';

import { Dashboard } from './features/dashboard/dashboard';

import { ProjectList } from './features/projects/project-list/project-list';
import { ProjectForm } from './features/projects/project-form/project-form';
import { ProjectDetail } from './features/projects/project-detail/project-detail';

import { DeliverableList } from './features/deliverables/deliverable-list/deliverable-list';
import { DeliverableForm } from './features/deliverables/deliverable-form/deliverable-form';


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


      // PROYECTOS

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
      },


      // ENTREGABLES

      {
        path: 'deliverables',
        component: DeliverableList
      },

      {
        path: 'deliverables/new',
        component: DeliverableForm
      },

      {
        path: 'deliverables/:id/edit',
        component: DeliverableForm
      }

    ]
  },


  {
    path: '**',
    redirectTo: 'dashboard'
  }

];