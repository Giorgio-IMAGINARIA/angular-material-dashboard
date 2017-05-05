import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// interface DbWorksPropertiesInterface {
//     role: string,
//     comPro: string;
//     href: string;
//     initialTime: string;
//     finalTime: string;
//     amount: string;
//     city: string;
//     country: string;
//     description: string;
// }
@Injectable()
export class DbDataService {
    public currentElasticDbState: any = null;
    public activeElasticDbStateSubject: Subject<Array<any>> = new Subject<Array<any>>();
    public activeElasticDbStateObservable: Observable<Array<any>> = this.activeElasticDbStateSubject.asObservable();
    constructor(protected http: Http) { }
    private setElasticDbState(nextState: any): void {
        // console.log('from the client ElasticDbService', nextState);
        this.currentElasticDbState = nextState;
        this.activeElasticDbStateSubject.next(nextState);
    }

    sendRequest(filter: any): void {
        let elasticArrayDownloaded: any = [{ mockProperty: "mocktext" }];
        setTimeout(this.setElasticDbState.bind(this, elasticArrayDownloaded));
        //     let addressToPass: string = '/db/data';
        //     let headers = new Headers({ 'Content-Type': 'application/json' });
        //     let options = new RequestOptions({ headers: headers });
        //     let body = JSON.stringify(filter);
        //     this.http.post(
        //         addressToPass,
        //         body,
        //         options
        //     ).subscribe((data: Response) => {
        //         try {
        //             let elasticArrayDownloaded = data.json().elasticDBArray;
        //             for (let i = 0; i < elasticArrayDownloaded.length; i++) {
        //                 let objectToChange = elasticArrayDownloaded[i]._source;
        //                 Object.defineProperty(objectToChange, 'timestamp', Object.getOwnPropertyDescriptor(objectToChange, '@timestamp'));
        //                 delete objectToChange['@timestamp'];
        //             }
        //             this.setElasticDbState(elasticArrayDownloaded);
        //         }
        //         catch (err) {
        //             console.log(err);
        //         }
        //     });
    }

}