import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Device } from '../device';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: [ './device-detail.component.css' ]
})
export class DeviceDetailComponent implements OnInit {
  device!: Device;

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getDevice();
  }

  getDevice(): void {
    const id = this.route.snapshot.paramMap.get('id')  || JSON.parse('11');
    this.deviceService.getDevice(id)
      .subscribe(device => this.device = device);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.deviceService.updateDevice(this.device)
      .subscribe(() => this.goBack());
  }
}