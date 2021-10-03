import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { particle_init } from 'src/assets/js/app';
import { SubscriptionPlanService, AlertService } from 'src/app/core/services';

import * as Utils from 'src/app/core/helpers/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  utils = Utils;

  postCode: number;

  globalPlans = [];

  constructor(
    private _router: Router,
    private _spService: SubscriptionPlanService,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    particle_init();

    this._spService.readAvailable().subscribe((plans) => {
      this._alertService.setAppLoading();
      this.globalPlans = plans;
    }, (err) => {
      this._alertService.clearAppLoading();
    });
  }

  onSubmit(): void {
  }
}
