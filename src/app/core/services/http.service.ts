import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(public _http: HttpClient) { }

  public get(url): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(url, { headers }).pipe(map(response => response));
  }

  public post(url, params): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = JSON.stringify(params);

    return this._http.post(url, body, { headers }).pipe(map(response => response));
  }

  public put(url, params): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify(params);

    return this._http.put(url, body, { headers }).pipe(map(response => response));
  }

  public delete(url): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._http.delete(url, { headers }).pipe(map(response => response));
  }

}
