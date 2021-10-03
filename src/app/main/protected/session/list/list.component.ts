import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService, SessionService } from 'app/core/services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
    selector: 'app-session-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class SessionListComponent implements OnInit {

    displayedColumns: string[] = ['No', 'user', 'sessionID', 'deviceID', 'deviceName', 'expiresIn', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    loading = false;

    constructor(
        private _sessionService: SessionService,
        private _alertService: AlertService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        const expands = ['user'];
        this._sessionService.getAll(expands).subscribe((sessions) => {
            this.dataSource = new MatTableDataSource(sessions);

            this.dataSource.paginator = this.paginator;

            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'user': return item.user ? (item.user.firstName + ' ' + item.user.lastName) : '';
                    default: return item[property];
                }
            };

            this.dataSource.sort = this.sort;

            this.loading = false;
        }, () => {
            this.loading = false;

            this._alertService.openSnackBar('Error occured while get users.', 'error');
        });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onDelete(sessionID): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;

                this._sessionService.delete(sessionID).subscribe(() => {
                    this.loading = false;

                    this._alertService.openSnackBar('Session deleted successfully.', 'success');
                    this.loadData();
                }, (err) => {
                    this.loading = false;
                    
                    this._alertService.openSnackBar('Error occured while delete session.', 'error');
                    console.log(err);
                });
            }
            this.confirmDialogRef = null;
        });
    }
}
