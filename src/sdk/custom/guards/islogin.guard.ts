import { CanActivate, Router } from '@angular/router';

import { AuthService } from 'src/sdk/core/auth.service';
import {AlertService } from 'src/sdk/custom/alert.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  constructor(private router: Router,private alertService:AlertService, private authService: AuthService) {}

  async canActivate() {
    const atoken='token';
    const token = await this.authService.getTokenFromStorage(atoken);
    if (!token) {
      this.alertService.presentAlertConfirm('Please Login first to go ahead','Error');
      this.router.navigateByUrl('/login');
    } else {
      return true;
    }
  }
}
