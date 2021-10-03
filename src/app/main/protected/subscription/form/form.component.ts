import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormType } from 'app/core/enums/FormType';
import { SubscriptionPlanService, AlertService, SubscriptionService, UserService } from 'app/core/services';
import { PaymentMethod } from 'app/core/enums/PaymentMethod';
import { PaymentStatus } from 'app/core/enums/PaymentStatus';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class SubscriptionFormComponent implements OnInit {

  @Input() formType;
  @Input() subscriptionId;

  // variables
  isNew = false;
  form: FormGroup;
  formIsSubmitted = false;

  subPlans = [];
  users = [];

  paymentMethods = PaymentMethod;
  paymentStatuses = PaymentStatus;

  validationErrors = null;

  loadingPlan = false;
  loadingSc = false;
  loadingUser = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _scpService: SubscriptionPlanService,
    private _scService: SubscriptionService,
    private _userService: UserService,
    private _alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      planID: [null, null],
      userID: [null, null],
      paymentMethod: [null, null],
      paymentStatus: [null, null]
    });

    this.loadData();
  }

  loadData(): void {
    this.isNew = (this.formType === FormType.NEW);

    // get country list
    this.loadingPlan = true;

    this._scpService.getAll().subscribe((subPlans) => {
      this.subPlans = subPlans;

      this.loadingPlan = false;
    }, () => {
      this.loadingPlan = false;
    });

    // get user list
    this.loadingUser = true;

    this._userService.getAll().subscribe((users) => {
      this.users = users;

      this.loadingUser = false;
    }, () => {
      this.loadingUser = false;

      this._alertService.openSnackBar('Error occured while get usrs.', 'error');
    });

    // get subscription information and initialize form
    if (!this.isNew) {
      this.loadingSc = true;

      this._scService.getById(this.subscriptionId).subscribe((subscription) => {
        this.loadingSc = false;

        this.form.patchValue(subscription);
      }, (error) => {
        this.loadingSc = false;
        this._alertService.openSnackBar('Error occured while get subscription!', 'error');
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

    this.loadingSc = true;

    // create subscription
    if (this.isNew) {
      this._scService.create(this.form.value).subscribe(() => {
        this._alertService.openSnackBar('Subscription created successfully!', 'success');

        this.loadingSc = false;
        this._router.navigate(['/panel/subscription']);
      }, (error) => {
        this.loadingSc = false;

        if (error.status === 400) {
          this._alertService.openSnackBar('Validation error while create subscription!', 'error');
          this.validationErrors = error.error.validationErrors;

          this.setValidationError();
        } else {
          this._alertService.openSnackBar('Error occured while create subscription!', 'error');
        }
      });
    }
    // update subscription
    else {
      const data: any = this.form.value;
      data.id = this.subscriptionId;

      this._scService.update(data).subscribe(() => {
        this._alertService.openSnackBar('Subscription updated successfully!', 'success');

        this.loadingSc = false;
        this._router.navigate(['/panel/subscription']);
      }, (error) => {
        this.loadingSc = false;

        if (error.status === 400) {
          this._alertService.openSnackBar('Validation error while update subscription!', 'error');
          this.validationErrors = error.error.validationErrors;

          this.setValidationError();
        } else {
          this._alertService.openSnackBar('Error occured while update subscription!', 'error');
        }
      });
    }

  }

  // set validation errors from subscription
  setValidationError(): void {
    for (const key in this.validationErrors) {
      if (this.validationErrors[key]) {
        this.form.get(key).setErrors(this.validationErrors[key][1]);
      }
    }
  }

}
