import { Component, OnInit } from '@angular/core';
import { FormType } from 'app/core/enums/FormType';

@Component({
    selector: 'app-user-add',
    templateUrl: './user-add.component.html',
    styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
    formType;
    
    constructor() {
        this.formType = FormType.NEW;
    }

    ngOnInit(): void { }
}
