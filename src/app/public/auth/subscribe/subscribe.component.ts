import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';

import { UserService, AlertService, SubscriptionPlanService } from 'src/app/core/services';
import { CountryService } from 'src/app/core/services/country.service';
import { UserType } from 'src/app/core/enums/UserType';
import { UserRole } from 'src/app/core/enums/UserRole';
import * as Utils from 'src/app/core/helpers/utils';
import { PaymentType } from 'src/app/core/enums/PaymentType';
import { SharedDataService } from 'src/app/core/services/shareddata.service';
import { PasswordValidation } from 'src/app/shared/validations/password.validation';

declare let $;

@Component({
  selector: 'app-public-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})

export class PublicSbuscribeComponent implements OnInit {

  utils = Utils;

  registerForm: FormGroup;

  userTypes = UserType;   // individual or company
  paymentTypes = PaymentType;   // stripe or paypal

  loading = false;
  submitted = false;

  countries = [];   // registered countries
  planList = [];    // available plans for selected country

  selectedPlanID = 1;   // selected subscription plan id
  curPlanIdx = 1;   // order index of selected subscription plan

  curAmount = 0;
  curVat = 0;
  totalAmount = 0;
  selectedCurrency = 'USD';
  currencySign = '$';

  validationErrors = null;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRouter: ActivatedRoute,
    private _userService: UserService,
    private _countryService: CountryService,
    private _spService: SubscriptionPlanService,
    private _ngZone: NgZone,
    private _sNotify: SnotifyService,
    private _alertService: AlertService,
    private _sharedService: SharedDataService,
  ) {
    // get selected subscription plan id
    this.selectedPlanID = parseInt(this._activatedRouter.snapshot.params.planID, 10);
  }

  // init forms and events
  ngOnInit() {
    const superObj = this;

    $('.form-select').niceSelect();
    this.registerForm = this._fb.group({
      type: [UserType.INDIVIDUAL, Validators.required],
      roleID: [UserRole.REGULAR, null],
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6)]],
      password_confirmation: [null, null],
      countryID: [null, [Validators.required]],
      companyName: [null, Validators.required],
      companyAddress: [null, Validators.required],
      companyRegistrationNumber: [null, Validators.required],
      companyVATNumber: [null, Validators.required],
      contactFirstName: [null, Validators.required],
      contactLastName: [null, Validators.required],
      paymentType: [PaymentType.STRIPE, null],
      checkTerms: [null, null]
    }, {
      validator: PasswordValidation.NotMatchPassword
    });

    this.onChanges();
    this.loadData();

    // event for select user type - individual or company
    $('#select-type').on('change', function (e) {
      superObj._ngZone.run(() => {
        superObj.registerForm.get('type').setValue(e.target.value);
      });
    });

    // event for select country
    $('#select-country').on('change', function (e) {
      superObj._ngZone.run(() => {
        superObj.registerForm.get('countryID').setValue(e.target.value);

        superObj.loading = true;
        superObj._spService.readAvailable({ countryID: e.target.value }).subscribe((plans) => {
          superObj.planList = plans;

          if (plans && plans.length > 0) {
            if (superObj.curPlanIdx < plans.length) {
              superObj.selectedPlanID = plans[superObj.curPlanIdx].ID;
            } else {
              superObj.selectedPlanID = plans[0].ID;
              superObj.curPlanIdx = 0;
            }

            superObj.changeAmounts();
          }
          superObj.loading = false;
        }, (err) => {
          superObj.loading = false;
          console.log(err);
        });
      });
    });
  }

  // load data from server
  loadData(): void {
    this.loading = true;

    // load country from server
    this._countryService.getAll().subscribe((countries) => {
      this.countries = countries;
      this.loading = false;
      setTimeout(() => {
        $('select').niceSelect('update');
      });
    }, () => {
      this.loading = false;
    });

    this._alertService.setAppLoading();

    // load global available subscription plans from server
    this._spService.readAvailable().subscribe((plans) => {
      this.planList = plans;

      this.curPlanIdx = this.planList.findIndex((element) => {
        return element.ID === this.selectedPlanID;
      });

      this.changeAmounts();

      this._alertService.clearAppLoading();
    }, () => {
      this._alertService.clearAppLoading();
    });
  }

  // event for enter any information in to form input
  onChanges(): void {
    const superObj = this;

    // initialize error messages when enter to each form input
    for (const fieldName in this.registerForm.controls) {
      if (fieldName) {
        this.registerForm.get(fieldName).valueChanges.subscribe(() => {
          if (superObj.validationErrors && (fieldName in superObj.validationErrors)) {
            superObj.validationErrors[fieldName] = null;
          }
        });
      }
    }

    this.registerForm.valueChanges.subscribe(() => {
      this._alertService.clear();
    });
  }

  onSelectPlan(planId, idx): void {
    this.selectedPlanID = planId;
    this.curPlanIdx = idx;
    this.changeAmounts();
  }

  onSelectPayment(paymentType): void {
    this.registerForm.get('paymentType').setValue(paymentType);
  }

  // calculate prices when change country or plan
  changeAmounts(): void {
    const selectedPlan = this.planList.find(x => x.ID === this.selectedPlanID);
    this.selectedCurrency = selectedPlan.currency ? selectedPlan.currency.name : 'USD';
    this.currencySign = selectedPlan.currency ? selectedPlan.currency.sign : '$';
    this.curAmount = selectedPlan.price * selectedPlan.months;
    this.curVat = selectedPlan.VAT ? selectedPlan.VAT : 0;
    this.totalAmount = this.curAmount + (this.curAmount * this.curVat / 100);
    this.totalAmount = Math.round(this.totalAmount * 1e12) / 1e12;
  }

  // form submit
  onSubmit(event) {

    event.preventDefault();
    this.submitted = true;

    this.validationErrors = null;
    this._alertService.clear();

    // mandatory validation
    if (this.controls.email.invalid ||
      this.controls.password.invalid ||
      this.controls.countryID.invalid ||
      this.controls.password_confirmation.invalid) {
      this._sNotify.error('Some informations are invalid. Please check again.', { timeout: 3000 });
      return;
    }

    // validations according to User Type
    if (this.controls.type.value === UserType.INDIVIDUAL) {
      if (this.controls.firstName.invalid ||
        this.controls.lastName.invalid) {
        this._sNotify.error('Some informations are invalid. Please check again.', { timeout: 3000 });
        return;
      }
    } else {
      if (this.controls.companyName.invalid ||
        this.controls.companyAddress.invalid ||
        this.controls.companyRegistrationNumber.invalid ||
        this.controls.companyVATNumber.invalid ||
        this.controls.contactFirstName.invalid ||
        this.controls.contactLastName.invalid) {
        this._sNotify.error('Some informations are invalid. Please check again.', { timeout: 3000 });
        return;
      }
    }

    // check accept terms and conditions
    if (!this.controls.checkTerms.value) {
      alert('Please check terms and conditions.');
      return;
    }

    this.loading = true;

    const data = this.registerForm.value;

    // register user and create subscription, first register user
    this._userService.register(data)
      .subscribe(
        (user) => {

          this._sharedService.setPaymentType(this.controls.paymentType.value);
          this._sharedService.setSP(this.curPlanIdx);

          this._sharedService.setEmailNotVerified(this.controls.email.value);

          // go to verify email page
          this._router.navigate(['/auth/verifyemail']);
        },

        // user register error
        userErr => {
          this.loading = false;

          if (userErr.status === 400) {
            this._sNotify.error('Validation error while register user!', { timeout: 3000 });
            this.validationErrors = userErr.error.validationErrors;
          } else {
            this._sNotify.error('Error occured while create register user!', { timeout: 3000 });
          }
        });
  }

  get controls() { return this.registerForm.controls; }

  isInvalid(field) {
    return ((this.submitted || this.registerForm.get(field).touched) && this.registerForm.get(field).errors);
  }
}
