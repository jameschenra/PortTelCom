import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from 'app/core/helpers';

import { HttpService, LoadScriptService, AlertService } from 'app/core/services';

import { AlertComponent } from './directives';
import { LoadingComponent } from './components/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { FuseConfirmDialogModule } from '@fuse/components';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FuseConfirmDialogModule
  ],
  declarations: [
    AlertComponent,
    LoadingComponent
  ],
  exports: [
    // Shared Components
    AlertComponent,
    LoadingComponent,

    // Shared Module
    FuseConfirmDialogModule
  ],
  providers: [
    HttpService,
    LoadScriptService,
    AlertService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class SharedAppModule { }
