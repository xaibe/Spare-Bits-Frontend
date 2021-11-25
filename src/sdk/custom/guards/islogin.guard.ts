import { CanActivate, Router } from '@angular/router';

import { AuthService } from 'src/sdk/core/auth.service';

import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  constructor(private router: Router,private toastService:ToastService, private authService: AuthService) {}

  async canActivate() {
    const atoken='token';
    const token = await this.authService.getTokenFromStorage(atoken);
    if (!token) {
      const msg="Please Login first to go ahead. Error!";
      this.toastService.presenterrorToast(msg);
      this.router.navigateByUrl('/login');
    } else {
      return true;
    }
  }
}
