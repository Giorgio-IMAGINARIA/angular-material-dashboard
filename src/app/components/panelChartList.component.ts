// ANGULAR COMPONENTS
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { MdDialog } from '@angular/material';
//Services
import { DbDataService } from '../services/db.data.service';


@Component({
    selector: 'panelChartList',
    templateUrl: '../templates/panelChartList.component.html',
    styleUrls: ['../styles/panelChartList.component.css']
})
export class PanelChartListComponent implements OnInit {

    private elasticDBServiceListener: any;
    private items: Array<any> = null;

    constructor(private DbDataService: DbDataService) { }

    ngOnInit() {
        this.checkElasticDbService();
    }

    ngOnDestroy(): void {
        this.elasticDBServiceListener.unsubscribe();
    }

    private checkElasticDbService(): void {
        this.elasticDBServiceListener = this.DbDataService.activeElasticDbStateSubject.subscribe(
            response => {
                if (response) {
                    // console.log('the response for the elastic objects is: ', response);
                    // this.items = response;
                } else {
                    console.log('no response for the elastic objects');
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }
}