import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormType } from 'app/core/enums/FormType';
import { CountryService, AlertService, SubscriptionPlanService, ListService, AuthService } from 'app/core/services';
import { Status } from 'app/core/enums/Status';
import { UserRole } from 'app/core/enums/UserRole';

@Component({
  selector: 'app-subscription-plan-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class SubPlanFormComponent implements OnInit {

  @Input() formType;
  @Input() planId;

  currentUser;
  userRoles = UserRole;

  // variables
  isNew = false;
  form: FormGroup;
  formIsSubmitted = false;

  countries = [];
  currencies = [];
  validationErrors = null;

  loadingCountry = false;
  loadingPlan = false;
  loadingCurrency = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _countryService: CountryService,
    private _listService: ListService,
    private _subPlanService: SubscriptionPlanService,
    private _alertService: AlertService,
    private _authService: AuthService
  ) {
    this.currentUser = this._authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      name: [null, null],
      description: [null, null],
      price: [null, null],
      priceCurrency: [null, null],
      countryID: [null, null],
      months: [null, null],
      days: [0, null],
      active: [Status.ACTIVE, null]
    });

    if (this.currentUser.roleID !== UserRole.ADMIN) {
      this.form.disable();
    }
    
    this.loadData();
  }

  loadData(): void {
    this.isNew = (this.formType === FormType.NEW);

    // when update disable all of fields except active field
    if (!this.isNew) {
      for (const key in this.form.controls) {
        if (!this.isNew && key !== 'active') {
          this.form.controls[key].disable();
        }
      }
    }

    // get country list
    this.loadingCountry = true;

    this._countryService.getAll().subscribe((countries) => {
      this.countries = countries;

      this.loadingCountry = false;
    }, () => {
      this.loadingCountry = false;
    });

    // get currencies
    this.loadingCurrency = true;
    this._listService.getAll('currencies').subscribe((currencies) => {
      this.currencies = currencies;

      this.loadingCurrency = false;
    }, () => {
      this.loadingCurrency = false;

      this._alertService.openSnackBar('Error occured while get currency', 'error');
    });

    // get user information and initialize form
    if (!this.isNew) {
      this.loadingPlan = true;

      this._subPlanService.getById(this.planId).subscribe((subPlan) => {
        this.loadingPlan = false;

        this.form.patchValue(subPlan);
      }, (error) => {
        this.loadingPlan = false;
        this._alertService.openSnackBar('Error occured while get subscriptino plan!', 'error');
      });
    }
  }

  get controls(): any { return this.form.controls; }

  isInvalid(field: string): boolean {
    return (
      (!this.form.get(field).valid)
    );
  }

  // form submit
  onSubmit(event): void {
    event.preventDefault();

    this.validationErrors = null;

    this.loadingPlan = true;

    // create server
    if (this.isNew) {
      this._subPlanService.create(this.form.value).subscribe(() => {
        this._alertService.openSnackBar('Server created successfully!', 'success');

        this.loadingPlan = false;
        this._router.navigate(['/panel/subplan']);
      }, (error) => {
        this.loadingPlan = false;

        if (error.status === 400) {
          this._alertService.openSnackBar('Validation error while create server!', 'error');
          this.validationErrors = error.error.validationErrors;

          this.setValidationError();
        } else {
          this._alertService.openSnackBar('Error occured while create server!', 'error');
        }
      });
    }
    // update server
    else {
      const data: any = this.form.value;
      data.id = this.planId;

      this._subPlanService.update(data).subscribe(() => {
        this._alertService.openSnackBar('Subscription plan updated successfully!', 'success');

        this.loadingPlan = false;
        this._router.navigate(['/panel/subplan']);
      }, (error) => {
        this.loadingPlan = false;

        if (error.status === 400) {
          this._alertService.openSnackBar('Validation error while update server!', 'error');
          this.validationErrors = error.error.validationErrors;

          this.setValidationError();
        } else {
          this._alertService.openSnackBar('Error occured while update server!', 'error');
        }
      });
    }

  }

  // set validation errors from server
  setValidationError(): void {
    for (const key in this.validationErrors) {
      if (this.validationErrors[key]) {
        this.form.get(key).setErrors(this.validationErrors[key][1]);
      }
    }
  }

}
