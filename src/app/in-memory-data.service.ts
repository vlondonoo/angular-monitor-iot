import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Device } from './device';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const devices = [
      { id: 11, name: 'sensorDeAgua' },
      { id: 12, name: 'Iluminacion' },
      { id: 13, name: 'phTierra' },
      { id: 14, name: 'Tamaño' },
      { id: 15, name: 'Cantidad' },
    ];
    return {devices};
  }

  // Overrides the genId method to ensure that a device always has an id.
  // If the devices array is empty,
  // the method below returns the initial number (11).
  // if the devices array is not empty, the method below returns the highest
  // device id + 1.
  genId(devices: Device[]): number {
    return devices.length > 0 ? Math.max(...devices.map(device => device.id)) + 1 : 11;
  }
}
