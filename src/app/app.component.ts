import { Component } from '@angular/core';
import { DeviceService } from './device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DeviceService]
})
export class AppComponent {
  title = 'Monitor y control de riego plantas';
}
