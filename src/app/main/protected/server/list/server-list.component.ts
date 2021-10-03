import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService, ServerService } from 'app/core/services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
    selector: 'app-server-list',
    templateUrl: './server-list.component.html',
    styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent implements OnInit {
    displayedColumns: string[] = ['No', 'number', 'country', 'ip', 'port', 'status', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    loading = false;

    constructor(
        private _serverService: ServerService,
        private _alertService: AlertService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        const expands = ['country'];

        this._serverService.getAll(expands).subscribe((servers) => {
            this.dataSource = new MatTableDataSource(servers);

            this.dataSource.paginator = this.paginator;

            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'country': return (item.country ? item.country.name : '');
                    case 'status': return (item.active ? 'Active' : 'Disabled');
                    default: return item[property];
                }
            };

            this.dataSource.sort = this.sort;

            this.loading = false;
        }, () => {
            this.loading = false;

            this._alertService.openSnackBar('Error occured while get servers.', 'error');
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

                this._serverService.delete(id).subscribe(() => {
                    this.loading = false;

                    this._alertService.openSnackBar('Server deleted successfully.', 'success');
                    this.loadData();
                }, (err) => {
                    this.loading = false;
                    
                    this._alertService.openSnackBar('Error occured while delete server.', 'error');
                    console.log(err);
                });
            }
            this.confirmDialogRef = null;
        });
    }
}
