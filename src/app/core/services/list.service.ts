import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'config';
import { Observable } from 'rxjs';

@Injectable()
export class ListService {
    constructor(private http: HttpService) { }

    getAll(table): Observable<any> {
        return this.http.get(`${config.apiUrl}/list/${table}`);
    }
}
