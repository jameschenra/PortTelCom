import { Component, OnInit } from '@angular/core';
import { FormType } from 'app/core/enums/FormType';

@Component({
    selector: 'app-subscription-plan-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class SubPlanAddComponent implements OnInit {
    formType;
    
    constructor() {
        this.formType = FormType.NEW;
    }

    ngOnInit(): void { }
}
