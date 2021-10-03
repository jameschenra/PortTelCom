import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatLibModule } from 'app/shared/matlib.module';
import { SharedAppModule } from 'app/shared/shared.module';

import { ServerService, CountryService, SubscriptionPlanService, ListService } from 'app/core/services';

import { SubPlanListComponent } from './list/list.component';
import { SubPlanAddComponent } from './add/add.component';
import { SubPlanFormComponent } from './form/form.component';
import { SubPlanEditComponent } from './edit/edit.component';

const routes = [
    {
        path     : 'add',
        component: SubPlanAddComponent
    },
    {
        path     : 'edit/:id',
        component: SubPlanEditComponent
    },
    {
        path     : '',
        component: SubPlanListComponent
    },
    {
        path     : '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        SubPlanListComponent,
        SubPlanAddComponent,
        SubPlanEditComponent,
        SubPlanFormComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        SharedAppModule,

        MatLibModule
    ],
    providers   : [
        SubscriptionPlanService,
        CountryService,
        ListService
    ]
})

export class SubscriptionPlanModule
{
}
