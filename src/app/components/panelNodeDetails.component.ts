// ANGULAR COMPONENTS
import { Component, OnInit, Input } from '@angular/core';

// SERVICES
import { NodePanelService } from '../services/nodePanel.service';

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

@Component({
    selector: 'panelNodeDetails',
    templateUrl: '../templates/panelNodeDetails.component.html',
    styleUrls: ['../styles/panelNodeDetails.component.css']
})

export class PanelNodeDetailsComponent {
    @Input() nodeDetailsChild: NodePanelPropertiesInterface;

    constructor(private nodePanelService: NodePanelService) { }


    closePanel(): void {
        console.log('close');
        this.nodePanelService.setNodePanelOpenState(false);
    }
}