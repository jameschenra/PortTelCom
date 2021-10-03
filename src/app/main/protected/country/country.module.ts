import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatLibModule } from 'app/shared/matlib.module';
import { SharedAppModule } from 'app/shared/shared.module';

import { CountryService } from 'app/core/services';

import { CountryListComponent } from './list/list.component';
import { CountryAddComponent } from './add/add.component';
import { CountryFormComponent } from './form/form.component';
import { CountryEditComponent } from './edit/edit.component';

const routes = [
    {
        path     : 'add',
        component: CountryAddComponent
    },
    {
        path     : 'edit/:id',
        component: CountryEditComponent
    },
    {
        path     : '',
        component: CountryListComponent
    },
    {
        path     : '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        CountryListComponent,
        CountryAddComponent,
        CountryEditComponent,
        CountryFormComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        SharedAppModule,

        MatLibModule
    ],
    providers   : [
        CountryService
    ]
})

export class CountryModule
{
}
