import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'config';
import { Observable } from 'rxjs';

import * as Utils from 'app/core/helpers/utils';

@Injectable()
export class SubscriptionService {
    constructor(private http: HttpService) { }

    getAll(expand?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expand);

        return this.http.get(`${config.apiUrl}/subscription${expandArg}`);
    }

    getById(id: number, expands?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/subscription/${id}${expandArg}`);
    }

    create(params: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/subscription/create`, params);
    }

    update(params: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/subscription/update/${params.id}`, params);
    }

    delete(id: number): Observable<any> {
        return this.http.get(`${config.apiUrl}/subscription/delete/` + id);
    }

}
