import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatSnackBarModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AuthGuard, PublicGuard } from './core/guards';
import { UserService } from './core/services';
import { SharedAppModule } from './shared/shared.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const appRoutes: Routes = [
    {
        path      : 'panel',
        canActivate: [AuthGuard],
        loadChildren: './main/protected/protected.module#ProtectedModule'
    },
    {
        path      : 'login',
        canActivate: [PublicGuard],
        loadChildren: './main/login/login.module#LoginModule'
    },
    {
        path      : '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SharedAppModule
    ],
    bootstrap   : [
        AppComponent
    ],
    providers   : [
        AuthGuard,
        PublicGuard,
        UserService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
})
export class AppModule
{
}
