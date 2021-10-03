import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';

@Injectable()
export class CountryService {
    constructor(private http: HttpService) { }

    getAll() {
        return this.http.get(`${config.apiUrl}/country`);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id);
    }

    register(user: any) {
        return this.http.post(`${config.apiUrl}/users/register`, user);
    }

    update(user: any) {
        return this.http.put(`${config.apiUrl}/users/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}
