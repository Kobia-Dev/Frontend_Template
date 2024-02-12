import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "../service/auth.service";
import { TokenCookieService } from "../service/token-storage-cookies.service";


@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private tokenCookieService: TokenCookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenCookieService.getUser()) {
      const userRole = this.tokenCookieService.getUser().roles;
      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        this.router.navigate(["/supplier-authentication/signin"]);
        return false;
      }
      return true;
    }

    this.router.navigate(["/supplier-authentication/signin"]);
    return false;
  }
}
