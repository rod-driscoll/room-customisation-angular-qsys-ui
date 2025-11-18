import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrwcAngularService } from '../../services/qrwc-angular-service';

@Component({
  selector: 'app-volume-control',
  imports: [CommonModule, FormsModule],
  templateUrl: './volume-control.html',
  styleUrl: './volume-control.css',
})
export class VolumeControl {
  readonly qrwc = inject(QrwcAngularService);
  readonly volumeLevel = signal(0);
  readonly isMuted = signal(false);

  constructor() {
    // Bind to Q-SYS Room Controls component
    effect(() => {
      const component = this.qrwc.components()?.['Room Controls'];
      if (!component) return;

      // Volume fader
      const volumeFader = component.controls['VolumeFader'];
      if (volumeFader) {
        this.volumeLevel.set(volumeFader.state.Value ?? 0);
        volumeFader.on('update', (state) => {
          this.volumeLevel.set(state.Value ?? 0);
        });
      }

      // Mute control
      const volumeMute = component.controls['VolumeMute'];
      if (volumeMute) {
        this.isMuted.set(volumeMute.state.Bool ?? false);
        volumeMute.on('update', (state) => {
          this.isMuted.set(state.Bool ?? false);
        });
      }
    });
  }

  volumeUp(): void {
    const component = this.qrwc.components()?.['Room Controls'];
    if (!component) return;

    const control = component.controls['VolumeUpDown[1]'];
    if (!control) return;

    // Trigger volume up
    control.update(true);
  }

  volumeDown(): void {
    const component = this.qrwc.components()?.['Room Controls'];
    if (!component) return;

    const control = component.controls['VolumeUpDown[2]'];
    if (!control) return;

    // Trigger volume down
    control.update(true);
  }

  toggleMute(): void {
    const component = this.qrwc.components()?.['Room Controls'];
    if (!component) return;

    const control = component.controls['VolumeMute'];
    if (!control) return;

    // Toggle mute
    control.update(!this.isMuted());
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);

    const component = this.qrwc.components()?.['Room Controls'];
    if (!component) return;

    const control = component.controls['VolumeFader'];
    if (!control) return;

    control.update(value);
  }
}
