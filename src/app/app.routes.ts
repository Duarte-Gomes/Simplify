import { Routes } from '@angular/router';
import { Tabs } from './tabs/tabs';

export const routes: Routes = [
  {
    path: '',
    component: Tabs,
    children: [
      { path: 'perfil', loadComponent: () => import('./profile/profile').then((m) => m.Profile) },
      {
        path: 'o-que-e',
        loadComponent: () => import('./identify/identify').then((m) => m.Identify),
      },
      {
        path: 'urgencia',
        loadComponent: () => import('./emergency/emergency').then((m) => m.Emergency),
      },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    ],
  },
];
