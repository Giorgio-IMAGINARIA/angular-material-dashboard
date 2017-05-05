// ANGULAR COMPONENTS
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { MdDialog } from '@angular/material';
// import {DialogOverviewExampleDialog} from '../components/dialogOverviewExampleDialog.component';

// SERVICES
import { NodePanelService } from '../services/nodePanel.service';
import { LinkPanelService } from '../services/linkPanel.service';

// INTERFACES
interface NodePanelPropertiesInterface {
    id: string;
    group: number;
    additionalInfo: {
        info1: string;
        info2: string;
        info3: string;
    };
}
interface LinkPanelPropertiesInterface {
    sourceID: string;
    sourceGroup: number;
    targetID: string;
    targetGroup: number;
    additionalInfo: {
        info1: string;
        info2: string;
        info3: string;
    };
}


@Component({
    selector: 'dashboard',
    templateUrl: '../templates/dashboard.component.html',
    styleUrls: ['../styles/dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    private nodeDetailsParent: NodePanelPropertiesInterface = {
        "id": null,
        "group": null,
        "additionalInfo": {
            "info1": null,
            "info2": null,
            "info3": null
        }
    };
    private linkDetailsParent: LinkPanelPropertiesInterface = {
        "sourceID": null,
        "sourceGroup": null,
        "targetID": null,
        "targetGroup": null,
        "additionalInfo": {
            "info1": null,
            "info2": null,
            "info3": null
        }
    };

    private nodesPanelActive: boolean = false;
    private linksPanelActive: boolean = false;


    selectedValue: string;

    dropChoices = [
        { value: 'choice-0', viewValue: 'Choice - 0' },
        { value: 'choice-1', viewValue: 'Choice - 1' },
        { value: 'choice-2', viewValue: 'Choice - 2' }
    ];


    checked = false;
    indeterminate = false;
    align = 'start';
    disabled = false;

    color: string;

    availableColors = [
        { name: 'none', color: '' },
        { name: 'Primary', color: 'primary' },
        { name: 'Accent', color: 'accent' },
        { name: 'Warn', color: 'warn' }
    ];

    favoriteChoice: string;

    choices = [
        'Choice - 1',
        'Choice - 2',
        'Choice - 3',
        'Choice - 4',
    ];

    gateways = [
        {
            name: 'Gateway1',
            updated: new Date('1/1/16'),
        },
        {
            name: 'Gateway2',
            updated: new Date('1/17/16'),
        },
        {
            name: 'Gateway3',
            updated: new Date('1/28/16'),
        }
    ];
    channels = [
        {
            name: 'Channel1',
            updated: new Date('2/20/16'),
        },
        {
            name: 'Channel2',
            updated: new Date('1/18/16'),
        }
    ];

    tooltipPosition = "below";

    private nodePanelServiceListener: any;
    private nodePanelOpenServiceListener: any;
    private linkPanelServiceListener: any;
    private linkPanelOpenServiceListener: any;


    constructor(private linkPanelService: LinkPanelService, private nodePanelService: NodePanelService, public dialog: MdDialog, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {


        iconRegistry.addSvgIcon(
            'menu-icon',
            sanitizer.bypassSecurityTrustResourceUrl('public/icons/ic_menu_white_48px.svg'));
        iconRegistry.addSvgIcon(
            'account-icon',
            sanitizer.bypassSecurityTrustResourceUrl('public/icons/ic_account_circle_white_48px.svg'));
    }
    ngOnInit() {
        this.checkNodePanelService();
        this.checkNodePanelOpenService();
        this.checkLinkPanelService();
        this.checkLinkPanelOpenService();
    }

    ngOnDestroy(): void {
        this.linkPanelServiceListener.unsubscribe();
        this.linkPanelOpenServiceListener.unsubscribe();
        this.linkPanelServiceListener.unsubscribe();
        this.linkPanelOpenServiceListener.unsubscribe();
    }

    private checkNodePanelService(): void {
        this.nodePanelServiceListener = this.nodePanelService.nodePanelStateSubject.subscribe(
            response => {
                if (response) {
                    console.log('the response for NodePanelService in dashboard is: ', response);
                    this.nodeDetailsParent = response;
                } else {
                    console.log('no response for checkNodePanelService - dashboard');
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }
    private checkNodePanelOpenService(): void {
        this.nodePanelOpenServiceListener = this.nodePanelService.nodePanelOpenStateSubject.subscribe(
            response => {
                this.nodesPanelActive = response;
                if (response) {
                    this.linksPanelActive = false;
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }

    private checkLinkPanelService(): void {
        this.linkPanelServiceListener = this.linkPanelService.linkPanelStateSubject.subscribe(
            response => {
                if (response) {
                    console.log('the response for LinkPanelService in dashboard is: ', response);
                    this.linkDetailsParent = response;
                } else {
                    console.log('no response for checkLinkPanelService - dashboard');
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }
    private checkLinkPanelOpenService(): void {
        this.linkPanelOpenServiceListener = this.linkPanelService.linkPanelOpenStateSubject.subscribe(
            response => {
                this.linksPanelActive = response;
                if (response) {
                    this.nodesPanelActive = false;
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }

    openDialog() {
        // this.dialog.open(DialogOverviewExampleDialog);
    }
}