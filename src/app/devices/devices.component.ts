import { Component, OnInit } from '@angular/core';
import { Device } from '../device';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices: Device[] = [];

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {

    this.getDevices();
  }

  getDevices(): void {
    this.deviceService.getDevices()
        .subscribe(devices => {
          this.devices = devices; });
  }
  add(name: string): void {
    name = name.trim();
    const id: number = new Date().getTime();
    if (!name) { return; }
    this.deviceService.addDevice({ id, name } as Device)
      .subscribe(device => {
        this.devices.push(device);
      });
  }

  delete(device: Device): void {
    this.devices = this.devices.filter(h => h !== device);
    this.deviceService.deleteDevice(device.id).subscribe();
  }
}
