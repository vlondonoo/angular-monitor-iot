import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Device } from './device';
import { MessageService } from './message.service';
import { environment } from './../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeviceService {

  private devicesUrl = environment.baseUrl;  // URL to web api

  httpOptions = {
    headers: new HttpHeaders(
      { 'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      Accept : '*/*' ,
      mode: 'no-cors'
     },
      )
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

 
  getDevices(): Observable<Device[]> {
    const variableURl = "/read"
    return this.http.get<Device[]>(variableURl)
      .pipe(
        map((response: any) => {
          console.log('respuesta: /read');
          return response.Items;
        }),
        tap(_ => this.log('fetched devices')),
        catchError(this.handleError<Device[]>('getDevices', []))
      ); 
  }

  /** GET device by id. Return `undefined` when id not found */
  getDeviceNo404<Data>(id: number): Observable<Device> {
    const url = `?id=${id}`;
    return this.http.get<Device[]>(url)
      .pipe(
        map((response: any) => { console.log('respuesta: /readOne', response); return response.Item}), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} device id=${id}`);
        }),
        catchError(this.handleError<Device>(`getDevice id=${id}`))
      );
  }

  /** GET device by id. Will 404 if id not found */
  getDevice(id: number): Observable<Device> {
    const url = `readOne/${id}`;
    return this.http.get<Device>(url).pipe(
      map((response: any) => {
        console.log('respuesta: /readOne', response);
        return response
      }),
      tap(_ => this.log(`fetched device id=${id}`)),
      catchError(this.handleError<Device>(`getDevice id=${id}`))
    );
  }

  /* GET devices whose name contains search term */
  searchDevices(term: string): Observable<Device[]> {
    if (!term.trim()) {
      // if not search term, return empty device array.
      return of([]);
    }
    return this.http.get<Device[]>(`${this.devicesUrl}/readName/?name=${term}`).pipe(
      map((response: any) => {
        console.log('respuesta: /readName', response);
        return response
      }),
      tap(x => x.length ?
         this.log(`found devices matching "${term}"`) :
         this.log(`no devices matching "${term}"`)),
      catchError(this.handleError<Device[]>('searchDevices', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new device to the server */
  addDevice(device: Device, req?: any): Observable<Device> {

    const body = new HttpParams()
      .set('id', device.id.toString())
      .set('name', device.name);

      const b = JSON.stringify(body);

      console.log('device in add: ', device, 'request: ', req)
    return this.http.post<Device>(
      '/add',
      device,
      {headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
     "Access-Control-Allow-Origin": "*",
     'Access-Control-Allow-Credentials': 'true',
      },}
      )
      
      .pipe(
        map((response: any) => {
          console.log('respuesta: /add', response);
          return response
        }),
        tap((newDevice: Device) => this.log(`added device w/ id=${newDevice.id}`)),
        catchError(this.handleError<Device>('addDevice'))
      );
  }


   

  /** DELETE: delete the device from the server */
  deleteDevice(id: number): Observable<Device> {
    const url = `/deleteOne/${id}`;

    return this.http.delete<Device>(url, this.httpOptions).pipe(
      map((response: any) => {
        console.log('respuesta: /deleteOne', response);
        return response
      }),
      tap(_ => this.log(`deleted device id=${id}`)),
      catchError(this.handleError<Device>('deleteDevice'))
    );
  }

  /** PUT: update the device on the server */
  updateDevice(device: Device): Observable<any> {
    console.log('device in UPDATE: ', device)
    const body = new HttpParams()
      .set('id', device.id.toString())
      .set('name', device.name);




    return this.http.put('/update', body, this.httpOptions).pipe(
      tap(r => this.log(`updated device id=${device.id}`)),
      catchError(this.handleError<any>('updateDevice'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a DeviceService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DeviceService: ${message}`);
  }
}