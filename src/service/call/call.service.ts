import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { RequestOptions } from '@angular/http/src/base_request_options';
import { Observable } from 'rxjs';
import { Call } from '../../model/call';

@Injectable()
export class CallService {

    constructor(public http: HttpClient) { }

    private headers = new HttpHeaders().set('Content-Type', 'application/json');
    private url = 'http://temis.mybluemix.net';

    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

    getCall(type: string): Observable<Object> {
        return this.http.get(this.url + "/" + type)
            .pipe(
                (res => res)
            );
    }

    insertCall(params: any): Observable<Object> {
        return this.http.post(this.url + "/call", params)
            .pipe(
                (res => res)
            );


    }
}