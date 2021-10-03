import { Component, OnInit } from '@angular/core';
import { FormType } from 'app/core/enums/FormType';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-server-edit',
    templateUrl: './server-edit.component.html',
    styleUrls: ['./server-edit.component.scss']
})
export class ServerEditComponent implements OnInit {

    formType;
    serverId;

    constructor(private _aRouter: ActivatedRoute) {
        this.formType = FormType.EDIT;
        this.serverId = this._aRouter.snapshot.params.id;
    }

    ngOnInit(): void {
    }
}
