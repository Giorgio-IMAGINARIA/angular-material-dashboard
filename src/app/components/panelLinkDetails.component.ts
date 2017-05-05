// ANGULAR COMPONENTS
import { Component, OnInit, Input } from '@angular/core';

// SERVICES
import { LinkPanelService } from '../services/linkPanel.service';

// INTERFACES
interface LinkPanelPropertiesInterface {
        sourceID: null,
        sourceGroup: null,
        targetID: null,
        targetGroup: null,
        additionalInfo: {
            info1: null,
            info2: null,
            info3: null
        }
    };

@Component({
    selector: 'panelLinkDetails',
    templateUrl: '../templates/panelLinkDetails.component.html',
    styleUrls: ['../styles/panelLinkDetails.component.css']
})

export class PanelLinkDetailsComponent {
    @Input() linkDetailsChild: LinkPanelPropertiesInterface;

    constructor(private linkPanelService: LinkPanelService) { }


    closePanel(): void {
        console.log('close');
        this.linkPanelService.setLinkPanelOpenState(false);
    }
}