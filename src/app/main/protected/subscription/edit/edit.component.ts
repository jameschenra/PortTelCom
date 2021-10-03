import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService, AlertService } from 'app/core/services';

@Component({
    selector: 'app-subscription-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class SubscriptionEditComponent implements OnInit {

    subscriptionId;
    subscription;

    loading = false;

    constructor(
        private _aRouter: ActivatedRoute,
        private _scService: SubscriptionService,
        private _alertService: AlertService
    ) {
        this.subscriptionId = this._aRouter.snapshot.params.id;
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        const expands = ['user', 'subscriptionPlan', 'paymentMethod', 'paymentStatus'];

        this._scService.getById(this.subscriptionId, expands).subscribe((subscription) => {
            this.subscription = subscription;

            this.loading = false;
        }, () => {
            this.loading = false;

            this._alertService.openSnackBar('Error occured while get subscription information', 'error');
        });
    }
}
