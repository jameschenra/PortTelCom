import { Component, OnInit } from '@angular/core';
import { FormType } from 'app/core/enums/FormType';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-country-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class CountryEditComponent implements OnInit {

    formType;
    countryId;

    constructor(private _aRouter: ActivatedRoute) {
        this.formType = FormType.EDIT;
        this.countryId = this._aRouter.snapshot.params.id;
    }

    ngOnInit(): void {
    }
}
