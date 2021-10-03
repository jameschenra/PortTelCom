import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatLibModule } from 'app/shared/matlib.module';
import { SharedAppModule } from 'app/shared/shared.module';

import { SubscriptionService, UserService, SubscriptionPlanService } from 'app/core/services';

import { SubscriptionListComponent } from './list/list.component';
import { SubscriptionAddComponent } from './add/add.component';
import { SubscriptionFormComponent } from './form/form.component';
import { SubscriptionEditComponent } from './edit/edit.component';

const routes = [
    {
        path     : 'add',
        component: SubscriptionAddComponent
    },
    {
        path     : 'edit/:id',
        component: SubscriptionEditComponent
    },
    {
        path     : '',
        component: SubscriptionListComponent
    },
    {
        path     : '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        SubscriptionListComponent,
        SubscriptionAddComponent,
        SubscriptionEditComponent,
        SubscriptionFormComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        SharedAppModule,

        MatLibModule
    ],
    providers   : [
        SubscriptionService,
        SubscriptionPlanService,
        UserService
    ]
})

export class SubscriptionModule
{
}
