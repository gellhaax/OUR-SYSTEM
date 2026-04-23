import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
  path: 'records',
  loadComponent: () => import('./records/records').then(m => m.Records)
},
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings').then(m => m.Settings)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then(m => m.About)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact').then(m => m.Contact)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];