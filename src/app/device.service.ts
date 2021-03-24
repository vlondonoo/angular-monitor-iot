import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Device } from './device';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class DeviceService {

  private devicesUrl = 'api/devices';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

 
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.devicesUrl)
      .pipe(
        tap(_ => this.log('fetched devices')),
        catchError(this.handleError<Device[]>('getDevices', []))
      );
  }

  /** GET device by id. Return `undefined` when id not found */
  getDeviceNo404<Data>(id: number): Observable<Device> {
    const url = `${this.devicesUrl}/?id=${id}`;
    return this.http.get<Device[]>(url)
      .pipe(
        map(devices => devices[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} device id=${id}`);
        }),
        catchError(this.handleError<Device>(`getDevice id=${id}`))
      );
  }

  /** GET device by id. Will 404 if id not found */
  getDevice(id: number): Observable<Device> {
    const url = `${this.devicesUrl}/${id}`;
    return this.http.get<Device>(url).pipe(
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
    return this.http.get<Device[]>(`${this.devicesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found devices matching "${term}"`) :
         this.log(`no devices matching "${term}"`)),
      catchError(this.handleError<Device[]>('searchDevices', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new device to the server */
  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(this.devicesUrl, device, this.httpOptions).pipe(
      tap((newDevice: Device) => this.log(`added device w/ id=${newDevice.id}`)),
      catchError(this.handleError<Device>('addDevice'))
    );
  }

  /** DELETE: delete the device from the server */
  deleteDevice(id: number): Observable<Device> {
    const url = `${this.devicesUrl}/${id}`;

    return this.http.delete<Device>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted device id=${id}`)),
      catchError(this.handleError<Device>('deleteDevice'))
    );
  }

  /** PUT: update the device on the server */
  updateDevice(device: Device): Observable<any> {
    return this.http.put(this.devicesUrl, device, this.httpOptions).pipe(
      tap(_ => this.log(`updated device id=${device.id}`)),
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