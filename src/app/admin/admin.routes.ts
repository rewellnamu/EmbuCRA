import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RevenueManagementComponent } from './revenue-management/revenue-management.component';
import { DepartmentsManagementComponent } from './departments-management/departments-management.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { TendersManagementComponent } from './tenders-management/tenders-management.component';
import { ServicesManagementComponent } from './services-management/services-management.component';
import { NewsManagementComponent } from './news-management/news-management.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'revenue-streams',
        component: RevenueManagementComponent
      },
      {
        path: 'departments',
        component: DepartmentsManagementComponent
      },
      {
        path: 'tenders',
        component: TendersManagementComponent
      },
      {
        path: 'services',
        component: ServicesManagementComponent
      },
      {
        path: 'news',
        component: NewsManagementComponent
      },
      {
        path: 'content',
        component: ContentManagementComponent
      }
    ]
  }
];