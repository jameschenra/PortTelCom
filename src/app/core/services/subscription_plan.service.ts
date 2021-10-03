import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';

@Injectable()
export class SubscriptionPlanService {
    constructor(private http: HttpService) { }

    readAvailable(params?) {
        let url = `${config.apiUrl}/subscriptionPlan/readAvailable`;

        if (params) {
            url += '?';

            let countryID = null;
            if ('countryID' in params) {
                countryID = params.countryID;
                url += `countryID=${countryID}`;
            }

            if ('active' in params) {
                if (countryID) {
                    url += '&';
                }
                url += `active=${params.active}`;
            }
        }

        return this.http.get(url);
    }
}
