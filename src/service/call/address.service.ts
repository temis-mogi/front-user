import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { RequestOptions } from '@angular/http/src/base_request_options';
import { Observable } from 'rxjs';
import { Call } from '../../model/call';

@Injectable()
export class AddressService {

    constructor(public http: HttpClient) { }

    private headers = new HttpHeaders().set('Content-Type', 'application/json');
    private url = 'http://68.183.137.124/address';

    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

    getAddress(lat: string, lng: string): Observable<Object> {
        let params = {
            "latitude": "-23.565900",
            "longitude": "-46.401960"
        }

        return this.http.post(this.url, params)
            .pipe(
                (res => res)
            );


    }
}