import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService, AlertService, AuthService } from 'app/core/services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserType } from 'app/core/enums/UserType';
import { UserRole } from 'app/core/enums/UserRole';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    currentUser;
    userRoles = UserRole;
    userTypes = UserType;
    
    displayedColumns: string[] = ['No', 'name', 'email', 'user_role', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    loading = false;

    constructor(
        private _userService: UserService,
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

        const expands = ['role'];

        this._userService.getAll(expands).subscribe((users) => {
            this.dataSource = new MatTableDataSource(users);

            this.dataSource.paginator = this.paginator;

            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'user_role': return item.role.name;
                    case 'name': return (item.firstName + ' ' + item.lastName);
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

    onDelete(id): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;

                this._userService.delete(id).subscribe(() => {
                    this.loading = false;

                    this._alertService.openSnackBar('User deleted successfully.', 'success');
                    this.loadData();
                }, (err) => {
                    this.loading = false;
                    
                    this._alertService.openSnackBar('Error occured while delete user.', 'error');
                    console.log(err);
                });
            }
            this.confirmDialogRef = null;
        });
    }
}
