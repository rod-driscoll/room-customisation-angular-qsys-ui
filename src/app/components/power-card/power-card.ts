import { Component, inject, effect, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrwcAngularService } from '../../services/qrwc-angular-service';

@Component({
  selector: 'app-power-card',
  imports: [CommonModule],
  templateUrl: './power-card.html',
  styleUrl: './power-card.css',
})
export class PowerCard {
  readonly qrwc = inject(QrwcAngularService);
  readonly shutdownPrompt = signal('Are you sure you want to power off?');
  readonly shutdownYesText = signal('Yes');
  readonly shutdownNoText = signal('No');
  readonly onClose = output<void>();

  constructor() {
    // Bind to Q-SYS UCI Text Helper component for text
    effect(() => {
      const component = this.qrwc.components()?.['UCI Text Helper'];
      if (!component) return;

      const promptControl = component.controls['ShutdownPrompt'];
      if (promptControl) {
        this.shutdownPrompt.set(promptControl.state.String ?? 'Are you sure you want to power off?');
        promptControl.on('update', (state) => {
          this.shutdownPrompt.set(state.String ?? 'Are you sure you want to power off?');
        });
      }

      const yesControl = component.controls['ShutdownYes'];
      if (yesControl) {
        this.shutdownYesText.set(yesControl.state.String ?? 'Yes');
        yesControl.on('update', (state) => {
          this.shutdownYesText.set(state.String ?? 'Yes');
        });
      }

      const noControl = component.controls['ShutdownNo'];
      if (noControl) {
        this.shutdownNoText.set(noControl.state.String ?? 'No');
        noControl.on('update', (state) => {
          this.shutdownNoText.set(state.String ?? 'No');
        });
      }
    });
  }

  confirmShutdown(): void {
    const component = this.qrwc.components()?.['Room Controls'];
    if (!component) return;

    const control = component.controls['SystemOff'];
    if (!control) return;

    control.update(true);
  }

  cancelShutdown(): void {
    this.onClose.emit();
  }
}
