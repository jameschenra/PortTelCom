import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';

@Injectable()
export class ContactService {
    constructor(private http: HttpService) { }

    sendContact(params) {
        return this.http.post(`${config.apiUrl}/contact`, params);
    }
}
