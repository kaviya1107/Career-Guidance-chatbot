import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // ✅ Correct way to use Router
  const isLoggedIn = !!localStorage.getItem('loggedInUser'); // Check if user is logged in

  if (!isLoggedIn) {
    router.navigate(['/commonlogin']); // Redirect to login page
    return false;
  }
  return true;
};
