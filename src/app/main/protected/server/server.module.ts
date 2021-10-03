import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatLibModule } from 'app/shared/matlib.module';
import { SharedAppModule } from 'app/shared/shared.module';

import { ServerListComponent } from './list/server-list.component';
import { ServerAddComponent } from './add/server-add.component';
import { ServerFormComponent } from './form/server-form.component';
import { ServerService, CountryService } from 'app/core/services';
import { ServerEditComponent } from './edit/server-edit.component';

const routes = [
    {
        path     : 'add',
        component: ServerAddComponent
    },
    {
        path     : 'edit/:id',
        component: ServerEditComponent
    },
    {
        path     : '',
        component: ServerListComponent
    },
    {
        path     : '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        ServerListComponent,
        ServerAddComponent,
        ServerEditComponent,
        ServerFormComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        SharedAppModule,

        MatLibModule
    ],
    providers   : [
        ServerService,
        CountryService
    ]
})

export class ServerModule
{
}
