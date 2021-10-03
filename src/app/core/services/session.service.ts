import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';

@Injectable()
export class SessionService {
    constructor(private http: HttpService) { }

    getList() {
        return this.http.get(`${config.apiUrl}/session`);
    }

    delete(sessionId) {
        return this.http.get(`${config.apiUrl}/session/delete/${sessionId}`);
    }
}
