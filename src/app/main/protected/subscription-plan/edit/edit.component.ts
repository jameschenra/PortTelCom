import { Component, OnInit } from '@angular/core';
import { FormType } from 'app/core/enums/FormType';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-subscription-plan-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class SubPlanEditComponent implements OnInit {

    formType;
    planId;

    constructor(private _aRouter: ActivatedRoute) {
        this.formType = FormType.EDIT;
        this.planId = this._aRouter.snapshot.params.id;
    }

    ngOnInit(): void {
    }
}
