import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormType } from 'app/core/enums/FormType';
import { CountryService, AlertService, ServerService } from 'app/core/services';
import { Status } from 'app/core/enums/Status';

@Component({
  selector: 'app-server-form',
  templateUrl: './server-form.component.html',
  styleUrls: ['./server-form.component.scss']
})

export class ServerFormComponent implements OnInit {

  @Input() formType;
  @Input() serverId;

  // variables
  isNew = false;
  form: FormGroup;
  formIsSubmitted = false;

  countries = [];
  validationErrors = null;

  loadingCountry = false;
  loadingServer = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _countryService: CountryService,
    private _serverService: ServerService,
    private _alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      countryID: [null, null],
      number: [null, null],
      ip: [null, null],
      port: [null, null],
      active: [Status.ACTIVE, null]
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
      this.loadingServer = true;

      this._serverService.getById(this.serverId).subscribe((server) => {
        this.loadingServer = false;

        this.form.patchValue(server);
      }, (error) => {
        this.loadingServer = false;
        this._alertService.openSnackBar('Error occured while get server!', 'error');
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

    this.loadingServer = true;

    // create server
    if (this.isNew) {
      this._serverService.create(this.form.value).subscribe(() => {
        this._alertService.openSnackBar('Server created successfully!', 'success');

        this.loadingServer = false;
        this._router.navigate(['/panel/server']);
      }, (error) => {
        this.loadingServer = false;

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
      data.id = this.serverId;

      this._serverService.update(data).subscribe(() => {
        this._alertService.openSnackBar('Server updated successfully!', 'success');

        this.loadingServer = false;
        this._router.navigate(['/panel/server']);
      }, (error) => {
        this.loadingServer = false;

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
