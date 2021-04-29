import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  searchDevices(name: string): Observable<Device[]> {
    if (!name.trim()) {
      // if not search term, return empty device array.
      return of([]);
    }
    return this.http.get<Device[]>(`${this.devicesUrl}/readName/${name}`).pipe(
      map((response: any) => {
        console.log('respuesta: /readName', response);
        return response
      }),
      tap(x => x.length ?
         this.log(`found devices matching "${name}"`) :
         this.log(`no devices matching "${name}"`)),
      catchError(this.handleError<Device[]>('searchDevices', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new device to the server */
  addDevice(device: Device): Observable<Device> {
    console.log('device in add: ', device)

    return this.http.post<Device>(
      `${this.devicesUrl}/add`,
      {
        id: device.id.toString(),
        name: device.name,
      },
      this.httpOptions,
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

    console.log('delete id: ', id)

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
    const updateDevice = {
      ...device.Item,
      name: device.name,
    }

    return this.http.put('/update', updateDevice, this.httpOptions).pipe(
      map((response: any) => {
        console.log('respuesta: /update', response);
        return response
      }),
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