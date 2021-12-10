import { CanActivate, Router } from "@angular/router";

import { AuthService } from "src/sdk/core/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RedirectLoginGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    const atoken = "token";
    //const localtoken = await this.authService.getItemFromStorage(atoken);
    //console.log("access token in canactivate =", localtoken);
    const token = await this.authService.getTokenFromStorage(atoken);
    console.log("access token in redirect canactivate =", token);
    if (token != null) {
      this.router.navigateByUrl("/home");
      console.log("access token in canactivate =", false);
      return false;
    } else {
      return true;
    }
  }
}
