import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const adminAuthService = inject(AdminAuthService);

  if (adminAuthService.isAuthenticated()) {
    return true;
  }

  // Not logged in, redirect to login page
  router.navigate(['/admin/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};