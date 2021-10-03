import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'config';
import { Observable } from 'rxjs';

import * as Utils from 'app/core/helpers/utils';

@Injectable()
export class ServerService {
    constructor(private http: HttpService) { }

    getAll(expand?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expand);

        return this.http.get(`${config.apiUrl}/server${expandArg}`);
    }

    getById(id: number, expands?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/server/${id}${expandArg}`);
    }

    create(params: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/server/create`, params);
    }

    update(params: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/server/update/${params.id}`, params);
    }

    delete(id: number): Observable<any> {
        return this.http.get(`${config.apiUrl}/server/delete/` + id);
    }

}
