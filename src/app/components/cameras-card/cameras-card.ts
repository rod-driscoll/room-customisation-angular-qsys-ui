import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrwcAngularService } from '../../services/qrwc-angular-service';

interface CameraControl {
  name: string;
  icon: string;
  controlName: string;
}

@Component({
  selector: 'app-cameras-card',
  imports: [CommonModule],
  templateUrl: './cameras-card.html',
  styleUrl: './cameras-card.css',
})
export class CamerasCard {
  readonly qrwc = inject(QrwcAngularService);

  readonly cameraControls: CameraControl[] = [
    { name: 'Pan Left', icon: 'arrow_back', controlName: 'PanLeft' },
    { name: 'Pan Right', icon: 'arrow_forward', controlName: 'PanRight' },
    { name: 'Tilt Up', icon: 'arrow_upward', controlName: 'TiltUp' },
    { name: 'Tilt Down', icon: 'arrow_downward', controlName: 'TiltDown' },
    { name: 'Zoom In', icon: 'zoom_in', controlName: 'ZoomIn' },
    { name: 'Zoom Out', icon: 'zoom_out', controlName: 'ZoomOut' },
  ];

  activateControl(controlName: string): void {
    const component = this.qrwc.components()?.['USB Video Bridge Core'];
    if (!component) return;

    const control = component.controls[controlName];
    if (!control) return;

    control.update(true);
  }

  deactivateControl(controlName: string): void {
    const component = this.qrwc.components()?.['USB Video Bridge Core'];
    if (!component) return;

    const control = component.controls[controlName];
    if (!control) return;

    control.update(false);
  }
}
