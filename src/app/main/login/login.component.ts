import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/services/auth.service';

import * as Utils from 'app/core/helpers/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from 'app/core/services';
import { UserRole } from 'app/core/enums/UserRole';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    loading = false;
    returnUrl: string;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private route: ActivatedRoute,
        private router: Router,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _alertService: AlertService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // reset login status
        this._authService.clear();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/panel';

        this.setOnChanges();
    }

    setOnChanges(): void {
        this.loginForm.valueChanges.subscribe(() => {
            this._alertService.clear();
        });
    }

    onSubmit(event): void {
        event.preventDefault();

        const data: any = this.loginForm.value;
        data.deviceID = Utils.uuidv4();
        data.deviceName = (window.navigator.userAgent).substring(0, 59);

        this.loading = true;

        this._authService.login(data)
            .pipe(first())
            .subscribe((user) => {
                this.loading = false;
                
                if (user && user.roleID === UserRole.REGULAR) {
                    this._authService.logout();

                    this._alertService.error('Regular user can\'t login here!');
                } else {
                    this.router.navigate([this.returnUrl]);
                }
            }, (error) => {
                this.loading = false;

                if (error.status === 400) {
                    this._alertService.error('Validation error!');
                } else if (error.status === 401) {
                    this._alertService.error(error.error.description);
                } else if (error.status === 403) {
                    this._alertService.error(error.error.description);
                } else {
                    this._alertService.error('Error occured while login!');
                }
            });
    }
}
