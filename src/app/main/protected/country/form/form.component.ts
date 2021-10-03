import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormType } from 'app/core/enums/FormType';
import { CountryService, AlertService, AuthService } from 'app/core/services';
import { Status } from 'app/core/enums/Status';
import { UserRole } from 'app/core/enums/UserRole';

@Component({
  selector: 'app-country-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class CountryFormComponent implements OnInit {

  @Input() formType;
  @Input() countryId;

  currentUser;
  userRoles = UserRole;

  // variables
  isNew = false;
  form: FormGroup;
  formIsSubmitted = false;

  countries = [];
  validationErrors = null;

  loading = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _countryService: CountryService,
    private _alertService: AlertService,
    private _authService: AuthService
  ) {
    this.currentUser = this._authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      name: [null, null],
      VAT: [null, null],
      active: [Status.ACTIVE, null]
    });

    if (this.currentUser.roleID !== UserRole.ADMIN) {
      this.form.disable();
    }

    this.loadData();
  }

  loadData(): void {
    this.isNew = (this.formType === FormType.NEW);

    // get user information and initialize form
    if (!this.isNew) {
      this.loading = true;

      this._countryService.getById(this.countryId).subscribe((country) => {
        this.form.patchValue(country);

        this.loading = false;
      }, (error) => {
        this.loading = false;

        this._alertService.openSnackBar('Error occured while get country!', 'error');
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

    this.loading = true;

    // create country
    if (this.isNew) {
      this._countryService.create(this.form.value).subscribe(() => {
        this._alertService.openSnackBar('Country created successfully!', 'success');

        this.loading = false;
        this._router.navigate(['/panel/country']);
      }, (error) => {
        this.loading = false;

        if (error.status === 400) {
          this._alertService.openSnackBar('Validation error while create country!', 'error');
          this.validationErrors = error.error.validationErrors;

          this.setValidationError();
        } else {
          this._alertService.openSnackBar('Error occured while create country!', 'error');
        }
      });
    }
    // update country
    else {
      const data: any = this.form.value;
      data.id = this.countryId;

      this._countryService.update(data).subscribe(() => {
        this._alertService.openSnackBar('Country updated successfully!', 'success');

        this.loading = false;
        this._router.navigate(['/panel/country']);
      }, (error) => {
        this.loading = false;

        if (error.status === 400) {
          this._alertService.openSnackBar('Validation error while update country!', 'error');
          this.validationErrors = error.error.validationErrors;

          this.setValidationError();
        } else {
          this._alertService.openSnackBar('Error occured while update country!', 'error');
        }
      });
    }

  }

  // set validation errors from country
  setValidationError(): void {
    for (const key in this.validationErrors) {
      if (this.validationErrors[key]) {
        this.form.get(key).setErrors(this.validationErrors[key][1]);
      }
    }
  }

}
