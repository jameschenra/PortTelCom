import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'config';
import { Observable } from 'rxjs';

import * as Utils from 'app/core/helpers/utils';

@Injectable()
export class UserService {
    constructor(private http: HttpService) { }

    getAll(expand?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expand);

        return this.http.get(`${config.apiUrl}/user${expandArg}`);
    }

    getById(id: number, expands?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/user/${id}${expandArg}`);
    }

    create(user: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/user/create`, user);
    }

    register(user: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/user/register`, user);
    }

    update(user: any): Observable<any> {
        return this.http.put(`${config.apiUrl}/user/${user.id}`, user);
    }

    delete(id: number): Observable<any> {
        return this.http.get(`${config.apiUrl}/user/delete/` + id);
    }

    verify(params): Observable<any> {
        return this.http.post(`${config.apiUrl}/user/verifyEmail`, params);
    }
}
