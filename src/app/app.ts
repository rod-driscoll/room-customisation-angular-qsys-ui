// Import Angular core functionality and lifecycle hooks
import { Component, inject, OnInit, signal, effect } from '@angular/core';
// Import our custom QRWC service for Q-SYS communication
import { QrwcAngularService } from './services/qrwc-angular-service';
import { SplashPage } from './components/splash-page/splash-page';
import { BasePage } from './components/base-page/base-page';

//import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    SplashPage,
    BasePage
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Signal to store the application title (reactive state)
  protected readonly title = signal('room-customisation-angular-qsys-ui');

  // Signal to track which page to show (splash or base)
  readonly showSplash = signal(true);
  
  // Default IP address for the Q-SYS Core 
  // Change this to match your Core's actual IP address if different
  // Can also be overridden using the 'host' query parameter in the URL
  readonly coreIpAddress = '192.168.104.227'; // emulation mode
  
  // Inject the QRWC service using Angular's dependency injection
  // This gives us access to Q-SYS Core communication throughout the app
  readonly qrwcService = inject(QrwcAngularService);

  constructor() {
    // Monitor system power state and show splash when powered off
    effect(() => {
      const component = this.qrwcService.components()?.['Room Controls'];
      if (!component) return;

      const systemOffControl = component.controls['SystemOff'];
      if (!systemOffControl) return;

      // If system is powered off, show splash page
      if (systemOffControl.state.Bool) {
        this.showSplash.set(true);
      }

      systemOffControl.on('update', (state) => {
        if (state.Bool) {
          this.showSplash.set(true);
        }
      });
    });
  }

  navigateToBase(): void {
    this.showSplash.set(false);
  }

  /**
   * Angular lifecycle hook - called after the component is initialized
   * This is where we establish the connection to the Q-SYS Core
   */
  async ngOnInit(): Promise<void> {
    // Parse URL query parameters to get configuration options
    const entries = this.getQueryParameters();
    const pollVal = entries['poll']; // Optional polling interval override
    const coreIP = String(entries['host'] ?? this.coreIpAddress); // Core IP (use query param or default)

    // Determine the polling interval for Q-SYS communication
    // Default to 200ms if not specified or invalid
    const pollingInterval =
      typeof pollVal === 'number'
        ? pollVal
        : parseInt(String(pollVal ?? ''), 10) || 200;

    // Attempt to connect to the Q-SYS Core
    // If connection fails, log the error but don't crash the app
    await this.qrwcService.connect(coreIP, pollingInterval).catch((err) => {
      console.error('QRWC connection error:', err);
    });
  }  
  
  /**
   * Get query parameters from the current URL.
   * - Returns a map where keys are lower-cased.
   * - Attempts to coerce numeric and boolean-looking values to the appropriate types.
   *
   * Examples of supported query parameters:
   * - ?host=192.168.1.100 (override Core IP address)
   * - ?poll=500 (set polling interval to 500ms)
   */
  getQueryParameters(): Record<string, string | number | boolean> {
    // If window isn't available (Server-Side Rendering), return an empty object
    if (typeof window === 'undefined' || !window.location) {
      return {};
    }

    // Parse the current URL and extract search parameters
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const queries: Record<string, string | number | boolean> = {};

    // Helper function to convert string values to appropriate types
    const parseValue = (v: string): string | number | boolean => {
      if (/^-?\d+$/.test(v)) return parseInt(v, 10); // Integer numbers
      if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v); // Decimal numbers
      if (/^(true|false)$/i.test(v)) return v.toLowerCase() === 'true'; // Booleans
      return v; // Keep as string
    };

    // Process each query parameter and convert values to appropriate types
    for (const [key, value] of params) {
      queries[key.toLowerCase()] = parseValue(value);
    }

    return queries;
  }
}
