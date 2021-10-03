import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormType } from 'app/core/enums/FormType';
import { UserRole } from 'app/core/enums/UserRole';
import { UserType } from 'app/core/enums/UserType';
import { CountryService, UserService, AlertService } from 'app/core/services';
import { PasswordValidation } from 'app/shared/validations/password.validation';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

  @Input() formType;
  @Input() userId;

  userTypes = UserType;
  // variables
  isNew = false;
  form: FormGroup;
  formIsSubmitted = false;

  countries = [];
  validationErrors = null;

  loadingCountry = false;
  loadingUser = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _countryService: CountryService,
    private _userService: UserService,
    private _alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      ID: [null, null],
      type : [UserType.INDIVIDUAL, null],
      roleID  : [UserRole.REGULAR, null],
      email  : ['', null],
      password      : [null, null],
      password_confirmation      : [null, null],
      firstName : ['', null],
      lastName : ['', null],
      countryID: [null, null],
      companyName: [null, null],
      companyAddress: [null, null],
      companyRegistrationNumber: [null, null],
      companyVATNumber: [null, null],
      contactFirstName: [null, null],
      contactLastName: [null, null],
    }, {
      validator: PasswordValidation.NotMatchPassword
    });

    this.loadData();
  }

  loadData(): void {
    this.isNew = (this.formType === FormType.NEW);

    // get country list
    this.loadingCountry = true;
    
    this._countryService.getAll().subscribe((countries) => {
      this.countries = countries;

      this.loadingCountry = false;
    }, () => {
      this.loadingCountry = false;
    });

    // get user information and initialize form
    if (!this.isNew) {
      this.loadingUser = true;

      this._userService.getById(this.userId).subscribe((user) => {
        console.log(user);
      }, (error) => {
        console.log(error);
        this._alertService.openSnackBar('Error occured while get user!', 'error');
      });
    }
  }

  get controls(): any { return this.form.controls; }

  isInvalid(field: string): boolean {
    return (
      (!this.form.get(field).valid)
    );
  }

  onSubmit(event): void {
    event.preventDefault();

    this.validationErrors = null;
    
    if (!this.controls.password_confirmation.valid) {
      return;
    }

    this.loadingUser = true;
    
    this._userService.create(this.form.value).subscribe(() => {
      this._alertService.openSnackBar('User created successfully!', 'success');

      this.loadingUser = false;
      this._router.navigate(['/panel/user']);
    }, (error) => {
      this.loadingUser = false;

      if (error.status === 400) {
        this._alertService.openSnackBar('Validation error while register user!', 'error');
        this.validationErrors = error.error.validationErrors;

        this.setValidationError();
      } else {
        this._alertService.openSnackBar('Error occured while register user!', 'error');
      }
    });
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
