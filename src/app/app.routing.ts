import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
,
 {
        path: 'dashboard',
        component: DashboardComponent
    }
    ,
    {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];
export const routing = RouterModule.forRoot(appRoutes);