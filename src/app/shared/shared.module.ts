import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from 'src/app/core/helpers';

import { HttpService } from 'src/app/core/services/http.service';
import { LoadScriptService, AlertService } from '../core/services';

import { AlertComponent } from './directives';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AlertComponent,
    LoadingComponent
  ],
  exports: [
    // Shared Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Shared Components
    AlertComponent,
    LoadingComponent
  ],
  providers: [
    AlertService,
    HttpService,
    LoadScriptService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class SharedAppModule { }
