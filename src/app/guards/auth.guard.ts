import { inject } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router  } from "@angular/router";
import { AuthService } from "../services/auth.service";

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.authService.isLoggedIn) {
            return true
        } else {
            this.router.navigate([''])
            return false
        }
    }
}

export const CanActivateGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    if(inject(AuthService).isLoggedIn) {
        return true
    } else {
        inject(Router).navigate(['/login'])
        return false
    }
}