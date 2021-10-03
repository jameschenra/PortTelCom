import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, UserService, AlertService } from '../services';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRole } from '../enums/UserRole';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService,
        private _userService: UserService,
        private _alertService: AlertService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (this.authService.isLoggedIn) {
            this._alertService.setAppLoading();
            return this._userService.getById(this.authService.getCurrentUser().ID).pipe(map(user => {
                if (user.roleID !== UserRole.REGULAR) {
                    this.authService.logout();
                    return false;
                } else {
                    this.authService.setCurrentUser(user);
                    this._alertService.clearAppLoading();
                    return true;
                }
            }, () => {
                this._alertService.clearAppLoading();
                return false;
            }));
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return of(false);
        }
    }
}
