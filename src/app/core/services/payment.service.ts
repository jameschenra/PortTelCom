import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';

@Injectable()
export class PaymentService {
    constructor(private http: HttpService) { }

    getHistory() {
        return this.http.get(`${config.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/user/` + id);
    }

    stripe_payment(params: any) {
        return this.http.post(`${config.apiUrl}/payment/stripe`, params);
    }

    paypal_payment(params: any) {
        return this.http.post(`${config.apiUrl}/payment/paypal`, params);
    }
}
