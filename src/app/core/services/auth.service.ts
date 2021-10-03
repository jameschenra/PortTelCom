import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { config } from 'config';
import { UserRole } from '../enums/UserRole';
import { HttpService } from './http.service';
import { AlertService } from './alert.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggedIn = false;

    private curUserInfo = new BehaviorSubject<any>(this.getCurrentUser());
    currentUser = this.curUserInfo.asObservable();

    constructor(private http: HttpClient,
        private router: Router,
        private httpService: HttpService,
        private _alertService: AlertService,
        private _fuseNavigationService: FuseNavigationService
    ) {
        if (!!this.getToken()) {
            try {
                this.setCurrentUser(this.getCurrentUser());
            } catch (error) {
                this.logout();
            }
        }
    }

    login(params): Observable<any> {
        return this.http.post<any>(`${config.apiUrl}/session/create`, params)
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                if (data && data.sessionID) {
                    if (data.user.roleID === UserRole.ADMIN) {
                        this._fuseNavigationService.setCurrentNavigation('main');
                    } else {
                        this._fuseNavigationService.setCurrentNavigation('support');
                    }

                    this.setLoggedin(data.sessionID, data.user);
                } else {
                    return false;
                }

                return data.user;
            }));
    }

    register(user: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/register`, user);
    }

    logout(): void {
        setTimeout(() => {
            this._alertService.setAppLoading();
        });

        const token = this.getToken();
        this.http.get(`${config.apiUrl}/session/delete/${token}`).subscribe((result) => {
            setTimeout(() => {
                this._alertService.clearAppLoading();
            });
        }, (err) => {
            setTimeout(() => {
                this._alertService.clearAppLoading();
            });
        });

        // remove user from local storage to log user out
        setTimeout(() => {
            this.clear();
            this._fuseNavigationService.setCurrentNavigation('support');
        });
    }

    setLoggedin(token, user): void {
        this.setToken(token);
        this.setCurrentUser(user);
    }

    setToken(token): void {
        localStorage.setItem('token', token);
    }

    getToken(): any {
        return localStorage.getItem('token');
    }

    setCurrentUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.curUserInfo.next(user);
        this.isLoggedIn = true;
    }

    getCurrentUser(): any {
        const curUser = localStorage.getItem('user');
        return JSON.parse(curUser);
    }

    clear(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
    }

    // isAdmin(): boolean {
    //     return (this.getCurrentUser().roleid === UserRole.ADMIN || this.getCurrentUser().roleid === UserRole.SUPER);
    // }

    sendPasswordResetLink(email): Observable<any> {
        return this.httpService.post(`${config.apiUrl}/passwordreset/sendPasswordResetLink`, email);
    }

    changePassword(data): Observable<any> {
        return this.httpService.post(`${config.apiUrl}/passwordreset/resetPassword`, data);
    }
}
