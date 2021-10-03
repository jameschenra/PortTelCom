import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService, SubscriptionPlanService, AuthService } from 'app/core/services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserRole } from 'app/core/enums/UserRole';

@Component({
    selector: 'app-subscription-plan-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class SubPlanListComponent implements OnInit {

    currentUser;
    userRoles = UserRole;

    displayedColumns: string[] = ['No', 'name', 'description', 'price', 'country', 'months', 'status', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    loading = false;

    constructor(
        private _subPlanService: SubscriptionPlanService,
        private _alertService: AlertService,
        public _matDialog: MatDialog,
        private _authService: AuthService
    ) {
        this.currentUser = this._authService.getCurrentUser();
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        const expands = ['country'];

        this._subPlanService.getAll(expands).subscribe((subPlans) => {
            this.dataSource = new MatTableDataSource(subPlans);

            this.dataSource.paginator = this.paginator;

            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'country': return (item.country ? item.country.name : '');
                    case 'status': return (item.active ? 'Active' : 'Disable');
                    default: return item[property];
                }
            };

            this.dataSource.sort = this.sort;

            this.loading = false;
        }, () => {
            this.loading = false;

            this._alertService.openSnackBar('Error occured while get subscription plan.', 'error');
        });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onDelete(id): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;

                this._subPlanService.delete(id).subscribe(() => {
                    this.loading = false;

                    this._alertService.openSnackBar('Subscription plan deleted successfully.', 'success');
                    this.loadData();
                }, (err) => {
                    this.loading = false;
                    
                    this._alertService.openSnackBar('Error occured while delete subscription plan.', 'error');
                    console.log(err);
                });
            }
            this.confirmDialogRef = null;
        });
    }
}