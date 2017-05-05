import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Data
import { ForceData } from '../data/forceData';
import { ForceDataChange } from '../data/forceDataChange';


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


interface ForceDirectedDataPropertiesInterface {
    nodes: Array<NodePanelPropertiesInterface>;
    links: Array<LinkPanelPropertiesInterface>;
}
@Injectable()
export class ForceChartDataProcessService {

    private temporaryCount: number = 0;
    public currentProcessedElasticDataState: ForceDirectedDataPropertiesInterface;
    public processedElasticDataStateSubject: Subject<any> = new Subject<any>();
    public processedElasticDataStateObservable: Observable<any> = this.processedElasticDataStateSubject.asObservable();



    ngOnInit(): void {
        this.currentProcessedElasticDataState = {
            nodes: [],
            links: []
        };
    }

    createForceDirectedData(elasticData: Array<any>): ForceDirectedDataPropertiesInterface {
        // PROCESS DATA HERE!!!
        if (this.temporaryCount === 0) {
            this.temporaryCount++;
            return (ForceData);
        } else if (this.temporaryCount === 1) {
            return (ForceDataChange);
        }
    }

    processElasticSearchData(elasticData: Array<any>): void {
        console.log('this is the data to process from elasticSearch: ', elasticData);
        let processedElasticData: ForceDirectedDataPropertiesInterface = this.createForceDirectedData(elasticData);
        this.currentProcessedElasticDataState = processedElasticData;
        this.processedElasticDataStateSubject.next(this.currentProcessedElasticDataState);


    }

}