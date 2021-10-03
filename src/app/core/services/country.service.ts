import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'config';
import { Observable } from 'rxjs';

import * as Utils from 'app/core/helpers/utils';

@Injectable()
export class CountryService {
    constructor(private http: HttpService) { }

    getAll(): Observable<any> {
        return this.http.get(`${config.apiUrl}/country`);
    }

    getById(id: number, expands?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/country/${id}${expandArg}`);
    }

    create(params: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/country/create`, params);
    }

    update(params: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/country/update/${params.id}`, params);
    }

    delete(id: number): Observable<any> {
        return this.http.post(`${config.apiUrl}/country/delete/` + id, {});
    }
}
