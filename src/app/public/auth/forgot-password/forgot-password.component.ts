import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserService, AlertService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';
import { SharedDataService } from 'src/app/core/services/shareddata.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;

  loading = false;
  submitted = false;

  validationErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _sNotify: SnotifyService,
    private _alertService: AlertService,
    private _sharedService: SharedDataService
  ) { }

  ngOnInit() {
    const email = this._sharedService.getEmailForgot();

    this.form = this.formBuilder.group({
      username: [email, null]
    });

    this.onChanges();
  }

  onChanges(): void {
    const superObj = this;
    for (const fieldName in this.form.controls) {
      if (fieldName) {
        this.form.get(fieldName).valueChanges.subscribe(() => {
          if (superObj.validationErrors && (fieldName in superObj.validationErrors)) {
            superObj.validationErrors[fieldName] = null;
          }
        });
      }
    }

    this.form.valueChanges.subscribe(() => {
      this._alertService.clear();
    });
  }

  onSubmit() {
    this.submitted = true;

    this.validationErrors = null;

    this.loading = true;
    this._userService.requestPassword(this.form.value).subscribe(
      () => {
        this._sNotify.success('Sent successfully request password reset.', { timeout: 3000 });

        this._sharedService.setEmailForgot(this.form.get('username').value);
        this._router.navigate(['/auth/resetpassword']);
        this.loading = false;
      },
      error => {
        if (error.status === 400) {
          this.validationErrors = error.error.validationErrors;
        } else if (error.status === 404) {
          this._alertService.error(error.error.description);
        } else {
          this._sNotify.error('Error occured while verify email.', { timeout: 3000 });
        }
        this.loading = false;
      }
    );
  }
}
