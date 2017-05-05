import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Interfaces
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



@Injectable()
export class LinkPanelService {

    public currentLinkPanelState: LinkPanelPropertiesInterface = {
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
    public linkPanelStateSubject: Subject<LinkPanelPropertiesInterface> = new Subject<LinkPanelPropertiesInterface>();
    public linkPanelStateObservable: Observable<LinkPanelPropertiesInterface> = this.linkPanelStateSubject.asObservable();

    public currentLinkPanelOpenState: boolean = false;
    public linkPanelOpenStateSubject: Subject<boolean> = new Subject<boolean>();
    public linkPanelOpenStateObservable: Observable<boolean> = this.linkPanelOpenStateSubject.asObservable();



    ngOnInit(): void {
        this.currentLinkPanelState.sourceID = null;
        this.currentLinkPanelState.sourceGroup = null;
        this.currentLinkPanelState.targetID = null;
        this.currentLinkPanelState.targetGroup = null;
        this.currentLinkPanelState.additionalInfo.info1 = null;
        this.currentLinkPanelState.additionalInfo.info2 = null;
        this.currentLinkPanelState.additionalInfo.info3 = null;
    }

    setLinkPanelState(nextState: LinkPanelPropertiesInterface): void {
        this.currentLinkPanelState = {
            sourceID: nextState.sourceID,
            sourceGroup: nextState.sourceGroup,
            targetID: nextState.targetID,
            targetGroup: nextState.targetGroup,
            additionalInfo: {
                info1: nextState.additionalInfo.info1,
                info2: nextState.additionalInfo.info2,
                info3: nextState.additionalInfo.info3
            }
        };
        this.linkPanelStateSubject.next(this.currentLinkPanelState);
    }

    setLinkPanelOpenState(nextState: boolean): void {
        this.currentLinkPanelOpenState = nextState;
        this.linkPanelOpenStateSubject.next(this.currentLinkPanelOpenState);
    }

}