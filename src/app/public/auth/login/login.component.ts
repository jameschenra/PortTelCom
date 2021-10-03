import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';

import * as Utils from 'src/app/core/helpers/utils';
import { UserRole } from 'src/app/core/enums/UserRole';
import { SharedDataService } from 'src/app/core/services/shareddata.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loading = false;
  submitted = false;
  returnUrl: string;

  validationErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private _sNotify: SnotifyService,
    private _sharedService: SharedDataService
  ) { }

  ngOnInit() {
    const email = this._sharedService.getEmailReset();
    this._sharedService.setEmailReset('');

    this.loginForm = this.formBuilder.group({
      username: [email, [Validators.required, Validators.email]],
      deviceID: ['', [Validators.required]],
      deviceName: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    // reset login status
    this.authService.clear();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';

    // https://alligator.io/angular/reactive-forms-valuechanges/
    this.onChanges();
  }

  onChanges(): void {
    const superObj = this;
    for (const fieldName in this.loginForm.controls) {
      if (fieldName) {
        this.loginForm.get(fieldName).valueChanges.subscribe(() => {
          if (superObj.validationErrors && (fieldName in superObj.validationErrors)) {
            superObj.validationErrors[fieldName] = null;
          }
        });
      }
    }

    this.loginForm.valueChanges.subscribe(() => {
      this.alertService.clear();
    });
  }

  onSubmit() {
    this.submitted = true;

    this.validationErrors = null;
    this.alertService.clear();

    const data: any = this.loginForm.value;
    data.deviceID = Utils.uuidv4();
    data.deviceName = (window.navigator.userAgent).substring(0, 59);

    this.loading = true;
    this.authService.login(data)
      .pipe(first())
      .subscribe(
        (user) => {
          this.loading = false;

          if (user && user.roleID !== UserRole.REGULAR) {
            this.authService.logout();

            this.alertService.error('Admin and Support can\'t login here!');
          } else {
            this._router.navigate([this.returnUrl]);
          }
        },
        error => {
          if (error.status === 400) {
            this.validationErrors = error.error.validationErrors;
            this.alertService.error('Validation error!');
          } else if (error.status === 401) {
            this.alertService.error(error.error.description);
          } else if (error.status === 403) {
            if (error.error.error === 1002) {
              this._sNotify.error(error.error.description, {timeout: 3000});
              this._sharedService.setEmailNotVerified(this.controls.username.value);
              this._router.navigate(['/auth/verifyemail']);
            } else {
              this.alertService.error(error.error.description);
            }
          } else {
            this.alertService.error('Error occured while login!');
          }

          this.loading = false;
        });
  }

  onForgot(event) {
    event.preventDefault();

    this._sharedService.setEmailForgot(this.controls.username.value);
    this._router.navigate(['/auth/forgot']);
  }

  // convenience getter for easy access to form fields
  get controls() { return this.loginForm.controls; }

  isInvalid(field) {
    return ((this.submitted || this.loginForm.get(field).touched) && this.loginForm.get(field).errors);
  }
}
