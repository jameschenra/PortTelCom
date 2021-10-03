import { Component, OnInit } from '@angular/core';
import { FormType } from 'app/core/enums/FormType';
import { ActivatedRoute } from '@angular/router';
import { UserService, AlertService, SubscriptionService } from 'app/core/services';
import { UserType } from 'app/core/enums/UserType';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    userTypes = UserType;
    formType;

    userId;
    user;
    activeSubscription;

    loading = false;

    constructor(
        private _activateRoute: ActivatedRoute,
        private _userService: UserService,
        private _alertService: AlertService,
        private _spService: SubscriptionService
    ) {
        this.userId = this._activateRoute.snapshot.params.id;
    }

    ngOnInit(): void {
        this.formType = FormType.EDIT;

        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        let expands = ['role', 'country'];

        this._userService.getById(this.userId, expands).subscribe((user) => {
            this.user = user;

            const activeSpId = user.activeSubscriptionID;

            if (activeSpId) {
                expands = ['subscriptionPlan'];

                this._spService.getById(activeSpId, expands).subscribe((result) => {
                    this.activeSubscription = result;

                    this.loading = false;
                }, () => {
                    this._alertService.openSnackBar('Error occured while get user information.', 'error');
                    this.loading = false;
                });
            } else {
                this.loading = false;
            }

        }, () => {
            this.loading = false;

            this._alertService.openSnackBar('Error occured while get user information.', 'error');
        });
    }
}
