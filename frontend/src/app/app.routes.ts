import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'recipes',
        pathMatch: 'full'
      },
      {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.routes').then(m => m.routes)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.routes)
      }
];
