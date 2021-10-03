import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'config';
import { Observable } from 'rxjs';

import * as Utils from 'app/core/helpers/utils';

@Injectable()
export class SessionService {
    constructor(private http: HttpService) { }

    getAll(expand?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expand);

        return this.http.get(`${config.apiUrl}/session${expandArg}`);
    }

    getById(id: number, expands?): Observable<any> {
        const expandArg = Utils.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/session/${id}${expandArg}`);
    }

    delete(id: number): Observable<any> {
        return this.http.get(`${config.apiUrl}/session/delete/` + id);
    }

}
