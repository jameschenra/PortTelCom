import { Injectable } from '@angular/core';
import { PaymentType } from '../enums/PaymentType';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedDataService {
    private emailNotVerified = null;
    private emailForgot = null;
    private emailReset = null;

    private paymentType = PaymentType.STRIPE;
    private sbcrPlan = null;

    constructor() { }

    setPaymentType(paymentType): void {
        this.paymentType = paymentType;
    }

    getPaymentType(): number {
        return this.paymentType;
    }

    // set subscription plan index in public register subscription
    setSP(spIdx): void {
        this.sbcrPlan = spIdx;
    }

    // get subscription plan index selected in public register subscription
    getSP(): number {
        return this.sbcrPlan;
    }

    getEmailNotVerified(): string {
        return this.emailNotVerified;
    }

    setEmailNotVerified(email) {
        this.emailNotVerified = email;
    }

    getEmailForgot(): string {
        return this.emailForgot;
    }

    setEmailForgot(email) {
        this.emailForgot = email;
    }

    getEmailReset(): string {
        return this.emailReset;
    }

    setEmailReset(email) {
        this.emailReset = email;
    }
}
