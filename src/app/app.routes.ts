import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

function isTokenValid(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return false;
  }
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (isTokenValid()) return true;

  router.navigate(['/login']);
  return false;
};
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (isTokenValid()) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
  },
];
