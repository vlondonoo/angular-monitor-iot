import { Component, OnInit } from '@angular/core';
import { Device } from '../device';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  devices: Device[] = [];
  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.getDevices();
  }
  getDevices(): void {
    this.deviceService.getDevices()
      .subscribe(devices => this.devices = devices.slice(1, 5));
  }
}


