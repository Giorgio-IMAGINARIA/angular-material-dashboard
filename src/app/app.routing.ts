import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
,
 {
        path: 'login',
        component: LoginComponent
    }
    ,
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
export const routing = RouterModule.forRoot(appRoutes);