import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import * as Utils from 'src/app/core/helpers/utils';

@Injectable()
export class SubscriptionService {
    constructor(private http: HttpService) { }

    create(params: any) {
        return this.http.post(`${config.apiUrl}/subscription/create`, params);
    }

    getList(expand?) {
        const expandArg = Utils.genExpandArgs(expand);

        return this.http.get(`${config.apiUrl}/subscription${expandArg}`);
    }

    getById(id, expands?) {
        const expandArg = Utils.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/subscription/${id}${expandArg}`);
    }
}
