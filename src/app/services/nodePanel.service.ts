import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Interfaces
interface NodePanelPropertiesInterface {
    id: string;
    group: number;
    additionalInfo: {
        info1: string;
        info2: string;
        info3: string;
    };
}
@Injectable()
export class NodePanelService {

    public currentNodePanelState: NodePanelPropertiesInterface = {
        id: null,
        group: null,
        additionalInfo: {
            info1: null,
            info2: null,
            info3: null
        }
    };
    public nodePanelStateSubject: Subject<NodePanelPropertiesInterface> = new Subject<NodePanelPropertiesInterface>();
    public nodePanelStateObservable: Observable<NodePanelPropertiesInterface> = this.nodePanelStateSubject.asObservable();

    public currentNodePanelOpenState: boolean = false;
    public nodePanelOpenStateSubject: Subject<boolean> = new Subject<boolean>();
    public nodePanelOpenStateObservable: Observable<boolean> = this.nodePanelOpenStateSubject.asObservable();



    ngOnInit(): void {
        this.currentNodePanelState.id = null;
        this.currentNodePanelState.group = null;
        this.currentNodePanelState.additionalInfo.info1 = null;
        this.currentNodePanelState.additionalInfo.info2 = null;
        this.currentNodePanelState.additionalInfo.info3 = null;
    }

    setNodePanelState(nextState: NodePanelPropertiesInterface): void {
        this.currentNodePanelState = {
            id: nextState.id,
            group: nextState.group,
            additionalInfo: {
                info1: nextState.additionalInfo.info1,
                info2: nextState.additionalInfo.info2,
                info3: nextState.additionalInfo.info3
            }
        };
        this.nodePanelStateSubject.next(this.currentNodePanelState);
    }

    setNodePanelOpenState(nextState: boolean): void {
        console.log('from here', nextState);
        this.currentNodePanelOpenState = nextState;
        this.nodePanelOpenStateSubject.next(this.currentNodePanelOpenState);
    }

}