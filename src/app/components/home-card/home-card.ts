import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrwcAngularService } from '../../services/qrwc-angular-service';

@Component({
  selector: 'app-home-card',
  imports: [CommonModule],
  templateUrl: './home-card.html',
  styleUrl: './home-card.css',
})
export class HomeCard {
  readonly qrwc = inject(QrwcAngularService);
  readonly sourceNames = signal<string[]>([]);
  readonly selectedSource = signal(0);

  constructor() {
    // Bind to Q-SYS UCI Text Helper for source names
    effect(() => {
      const textHelper = this.qrwc.components()?.['UCI Text Helper'];
      if (!textHelper) return;

      const sourceNamesControl = textHelper.controls['SourceNames'];
      if (sourceNamesControl && sourceNamesControl.state.Choices) {
        this.sourceNames.set(sourceNamesControl.state.Choices);
        sourceNamesControl.on('update', (state) => {
          if (state.Choices) {
            this.sourceNames.set(state.Choices);
          }
        });
      }
    });

    // Track selected source
    effect(() => {
      const hdmiComponent = this.qrwc.components()?.['HDMISourceSelect_1'];
      if (!hdmiComponent) return;

      // Find which selector is active
      for (let i = 0; i < 3; i++) {
        const controlName = `selector.${i}`;
        const control = hdmiComponent.controls[controlName];
        if (control && control.state.Bool) {
          this.selectedSource.set(i);
          control.on('update', (state) => {
            if (state.Bool) {
              this.selectedSource.set(i);
            }
          });
        }
      }
    });
  }

  selectSource(index: number): void {
    const component = this.qrwc.components()?.['HDMISourceSelect_1'];
    if (!component) return;

    const controlName = `selector.${index}`;
    const control = component.controls[controlName];
    if (!control) return;

    control.update(true);
  }

  getSourceIcon(index: number): string {
    const icons = ['hdmi', 'laptop', 'cable'];
    return icons[index] || 'input';
  }
}
