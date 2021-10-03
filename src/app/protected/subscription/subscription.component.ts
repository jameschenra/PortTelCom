import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionPlanService, AlertService, PaymentService, AuthService } from 'src/app/core/services';

import * as Utils from 'src/app/core/helpers/utils';
import { SnotifyService } from 'ng-snotify';
import { PaymentType } from 'src/app/core/enums/PaymentType';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { config } from 'src/config';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shareddata.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})

export class SubscriptionComponent implements OnInit {

  utils = Utils;
  paymentTypes = PaymentType;

  payPalConfig?: IPayPalConfig;

  form: FormGroup;

  currentUser;
  planList = [];
  monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList = [];

  paymentType;  // selected payment type
  selectedPlanID = 1;
  curAmount = 0;
  curVat = 0;
  totalAmount: any = 0;
  selectedCurrency = 'USD';
  currencySign = '$';
  checkTerm = true;

  loading = false;
  submitted = false;

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    private _spService: SubscriptionPlanService,
    private _alertService: AlertService,
    private _paymentService: PaymentService,
    private _sNotify: SnotifyService,
    private _authService: AuthService,
    private _sharedService: SharedDataService
  ) {
    this.currentUser = this._authService.getCurrentUser();
  }

  ngOnInit() {
    this.paymentType = this._sharedService.getPaymentType();
    this._sharedService.setPaymentType(null);
    if (!this.paymentType) {
      this.paymentType = PaymentType.STRIPE;
    }

    this.form = this.formBuilder.group({
      stripeName: [null, Validators.required],
      stripeNumber: [null, Validators.required],
      stripeYear: [null, Validators.required],
      stripeMonth: [null, Validators.required],
      stripeCVC: [null, Validators.required],
      stripePostal: [null, null]
    });

    // set stripe expire to current year and month
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    for (let i = curYear; i < curYear + 20; i++) {
      this.yearList.push(i);
    }

    this.form.get('stripeMonth').setValue(curDate.getMonth() + 1);
    this.form.get('stripeYear').setValue(curYear);

    this.onChanges();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this._spService.readAvailable().subscribe((plans) => {
      this.loading = false;
      this.planList = plans;

      let planIdx = this._sharedService.getSP();
      this._sharedService.setSP(null);
      if (planIdx === null) {
        planIdx = 0;
      }

      this.selectedPlanID = this.planList[planIdx].ID;
      this.changeAmounts();

      this.initPaypalConfig();
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(() => {

      this._alertService.clear();
    });
  }

  onSelectPlan(planId): void {
    this.selectedPlanID = planId;
    this.changeAmounts();
  }

  onSelectPayment(paymentType): void {
    this.paymentType = paymentType;
    if (this.paymentType === PaymentType.PAYPAL) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }

  changeAmounts(): void {
    const selectedPlan = this.planList.find(x => x.ID === this.selectedPlanID);
    this.selectedCurrency = selectedPlan.currency ? selectedPlan.currency.name : 'USD';
    this.currencySign = selectedPlan.currency ? selectedPlan.currency.sign : '$';
    this.curAmount = selectedPlan.price * selectedPlan.months;
    this.curVat = selectedPlan.VAT ? selectedPlan.VAT : 0;
    this.totalAmount = this.curAmount + (this.curAmount * this.curVat / 100);
    this.totalAmount = this.totalAmount.toFixed(2);
  }

  onSubmitStripe() {
    this.submitted = true;

    this._alertService.clear();

    if (this.form.invalid) {
      return;
    }

    // check accept terms and conditions
    if (!this.checkTerm) {
      alert('Please check terms and conditions.');
      return;
    }

    this.loading = true;

    const data = this.form.value;
    data.userID = this.currentUser.ID;
    data.amount = this.totalAmount;
    data.currency = this.selectedCurrency;
    data.planID = this.selectedPlanID;

    this._paymentService.stripe_payment(data)
      .subscribe(
        result => {
          this._sNotify.success('Successfully created!', { timeout: 3000 });
          this.loading = false;

          this._router.navigate(['/account/transactions']);
        },
        error => {
          if (error.status === 500) {
            if (error.error.error === 1090) {
              this._sNotify.error('Error occured while payment!', { timeout: 3000 });
              this._alertService.error(error.error.description);
            }
          } else {
            this._sNotify.error('Error occured while create!', { timeout: 3000 });
          }
          this.loading = false;
        });
  }

  private initPaypalConfig(): void {
    const superObj = this;
    const currency = this.selectedCurrency;
    this.payPalConfig = {
      currency: currency,
      clientId: config.PAYPAL_CLIENT_ID,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: this.totalAmount + '',
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: this.totalAmount + ''
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: currency,
                  value: this.totalAmount + '',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'horizontal',
        shape: 'rect'
      },
      onApprove: (data, actions) => {
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          // console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data: any) => {
        // console.log(data);
        data.planID = superObj.selectedPlanID;
        superObj._paymentService.paypal_payment(data).subscribe(() => {
          superObj._sNotify.success('Subscription created successfully.');
          superObj.loading = false;

          this._router.navigate(['/account/transactions']);
        }, (err) => {
          superObj._sNotify.error('Error occured while create subscription. Please contact to our service.');
          superObj.loading = false;
        });
      },
      onCancel: (data, actions) => {
        superObj.loading = false;
        // console.log('OnCancel', data, actions);
      },
      onError: err => {
        superObj.loading = false;
        superObj._sNotify.error('Error occured while payment.');
        console.log('OnError', err);
      },
      onClick: () => {
        superObj.loading = true;
      },
    };
  }

  onClickPaypal(event) {
    event.preventDefault();
  }
  get controls() { return this.form.controls; }

  isInvalid(field) {
    return ((this.submitted || this.form.get(field).touched) && this.form.get(field).errors);
  }

}
