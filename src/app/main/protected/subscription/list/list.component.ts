import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService, SubscriptionService } from 'app/core/services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
    selector: 'app-subscription-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class SubscriptionListComponent implements OnInit {
    displayedColumns: string[] = ['No', 'plan_name', 'user', 'apllied_vat',
        'start_date', 'end_date', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    loading = false;

    constructor(
        private _scService: SubscriptionService,
        private _alertService: AlertService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        const expands = ['user', 'subscriptionPlan'];

        this._scService.getAll(expands).subscribe((subscriptions) => {

            this.dataSource = new MatTableDataSource(subscriptions);

            this.dataSource.paginator = this.paginator;

            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'user': return (item.user ? (item.user.firstName + item.user.lastName) : '');
                    default: return item[property];
                }
            };

            this.dataSource.sort = this.sort;

            this.loading = false;
        }, () => {
            this.loading = false;

            this._alertService.openSnackBar('Error occured while get subscriptions.', 'error');
        });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
