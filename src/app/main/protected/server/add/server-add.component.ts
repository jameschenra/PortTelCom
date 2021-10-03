import { Component, OnInit } from '@angular/core';
import { FormType } from 'app/core/enums/FormType';

@Component({
    selector: 'app-server-add',
    templateUrl: './server-add.component.html',
    styleUrls: ['./server-add.component.scss']
})
export class ServerAddComponent implements OnInit {
    formType;
    
    constructor() {
        this.formType = FormType.NEW;
    }

    ngOnInit(): void { }
}
