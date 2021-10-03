import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import * as Utils from 'src/app/core/helpers/utils';

@Injectable()
export class UserService {
    constructor(private http: HttpService) { }

    getAll() {
        return this.http.get(`${config.apiUrl}/users`);
    }

    getById(id: number, expands?) {
        const expandArg = Utils.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/user/${id}${expandArg}`);
    }

    register(user: any) {
        return this.http.post(`${config.apiUrl}/user/register`, user);
    }

    update(user: any) {
        return this.http.put(`${config.apiUrl}/users/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }

    verify(params) {
        return this.http.post(`${config.apiUrl}/user/verifyEmail`, params);
    }

    requestVerify(params) {
        return this.http.post(`${config.apiUrl}/user/requestEmailVerification`, params);
    }

    changePassword(params) {
        return this.http.post(`${config.apiUrl}/user/changePassword`, params);
    }

    requestPassword(params) {
        return this.http.post(`${config.apiUrl}/user/requestPasswordReset`, params);
    }

    resetPassword(params) {
        return this.http.post(`${config.apiUrl}/user/resetPassword`, params);
    }
}
