import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatLibModule } from 'app/shared/matlib.module';
import { SharedAppModule } from 'app/shared/shared.module';

import { UserListComponent } from './list/user-list.component';
import { UserAddComponent } from './add/user-add.component';
import { UserFormComponent } from './form/user-form.component';
import { CountryService, UserService, SubscriptionService } from 'app/core/services';
import { UserEditComponent } from './edit/user-edit.component';

const routes = [
    {
        path     : 'add',
        component: UserAddComponent
    },
    {
        path     : 'edit/:id',
        component: UserEditComponent
    },
    {
        path     : '',
        component: UserListComponent
    },
    {
        path     : '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        UserListComponent,
        UserAddComponent,
        UserEditComponent,
        UserFormComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        SharedAppModule,

        MatLibModule
    ],
    providers   : [
        CountryService,
        UserService,
        SubscriptionService
    ]
})

export class UserModule
{
}
