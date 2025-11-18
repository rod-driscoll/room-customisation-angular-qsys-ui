// Import Angular's Injectable decorator and signal / computed for reactive state management.
import { Injectable, signal, computed } from '@angular/core';

// Import QRWC library types for Q-SYS communication.
import { Qrwc, Component } from '@q-sys/qrwc';

// Make this a global service available throughout the app as a singleton.
@Injectable({
  providedIn: 'root',
})
export class QrwcAngularService {
  // Store the QRWC connection instance (private so only this service can access it).
  private qrwc?: Qrwc;

  // Signal to track if we're connected to Q-SYS (components can subscribe to this)
  public readonly initialised = signal(false);

  // Plain object containing all Q-SYS components discovered from the Core
  // (not a signal because we don't want to react to individual control value changes)
  public readonly components = signal<Record<string, Component<string> | undefined>>({});

  constructor() {}

  /**
   * Connect to Q-SYS Core at the given IP address and set up event listeners.
   */
  public async connect(
    ipAddress: string,
    pollingInterval = 350
  ): Promise<Qrwc> {
    // If already connected, return the existing instance (don't reconnect)
    if (this.qrwc) return this.qrwc;

    console.log('🔄 QRWC - Setting up connection...');

    // Create a WebSocket connection to the Q-SYS Core's public API
    const socket = new WebSocket(`ws://${ipAddress}/qrc-public-api/v0`);

    // Log that we're starting the connection process
    console.log('🌐 QRWC - Connecting to Q-SYS Core at:', ipAddress);

    // Initialize the QRWC library with the socket and polling rate
    let qrwc: Qrwc;
    try {
      qrwc = await Qrwc.createQrwc({
        socket,
        pollingInterval: pollingInterval,
        // Optional filter to only include components we care about.
        componentFilter: (componentState) => {
          //return ['Status','Room Controls','UCI Text Helper','HDMISourceSelect_1'].includes(componentState.Name);
          return ['Status','Room Controls','UCI Text Helper','HDMISourceSelect_1'].includes(componentState.Name);
        }
      });
    } catch (err) {
      console.error('❌ QRWC - Connection failed:', err);

      // Start reconnect timer after 5 seconds
      setTimeout(() => {
        console.log('🔄 Attempting reconnection after createQRWC failure...');
        this.reconnect(ipAddress, pollingInterval);
      }, 5000);

      // Don't throw the error since we're going to retry automatically
      return Promise.reject(err);
    }

    // Log successful connection and show what components were discovered
    console.log('✅ QRWC - Instance connected successfully');

    // Store the discovered components (just a reference to the QRWC components object)
    this.components.set(qrwc.components);

    console.log(`🔍 QRWC - Available components:`, Object.keys(qrwc.components));
    //console.log(`🔧 QRWC - "Room Controls" Controls:`, Object.keys(qrwc.components['Room Controls'].controls));
    // console.log(`📊 QRWC - "Room Controls" Control:`, Object.keys(qrwc.components['Room Controls'].controls['SystemPower']));
    // console.log(`📊 QRWC - "Room Controls" Level:`, qrwc.components['Room Controls'].controls['Status'].state);

    // Listen for any control value updates from Q-SYS and log them
    qrwc.on('update', (component, control, state) => {
      let sysControlNames = [    
        /^log\.\w+/,      // Matches log. followed by one or more word chars
        /^script\.\w+/,   // Matches script. followed by one or more word chars
        /^halt\.\w+/,     // Matches halt. followed by one or more word chars
        /^magic\.number/, // Matches exact "magic.number"
        /^reload/         // Matches anything starting with "reload"
      ];
      if(sysControlNames.some(regex => regex.test(control.name))) {
        return; // Ignore system controls
      }
      console.log('📊 QRWC - Control Update:', `"${component.name}".${control.name}`, state);
    });

    // Listen for any errors from the QRWC connection
    qrwc.on('error', (error: Error) => {
      console.error('❌ QRWC - error:', error);
    });

    // If connection drops, try to reconnect after 5 seconds
    qrwc.on('disconnected', (reason: string) => {
      console.log('🔌 QRWC disconnected: ', reason);

      // Update UI signals and clear components
      this.initialised.set(false);
      this.components.set({});
      this.qrwc = undefined;

      // Try to reconnect after 5 seconds
      setTimeout(() => {
        console.log('🔄 Attempting reconnection...');
        this.reconnect(ipAddress, pollingInterval);
      }, 5000);
    });

    // Store the QRWC instance for future use
    this.qrwc = qrwc;

    // Update the connection status signal (UI can react to this)
    this.initialised.set(true);

    // Return the QRWC instance in case the caller needs it
    return qrwc;
  }

  /**
   * Try to reconnect using the saved connection settings
   */
  private async reconnect(
    ipAddress: string,
    pollingInterval: number
  ): Promise<void> {
    try {
      await this.connect(ipAddress, pollingInterval);
      console.log('✅ Reconnection successful!');
    } catch (err) {
      console.error('❌ Reconnection failed:', err);
    }
  }

  /**
   * Get a computed signal for a specific component by name.
   * Returns null if the component doesn't exist.
   */
  public getComputedComponent(componentName: string) {
    return computed(() => {
      // Check if we're connected
      if (!this.initialised()) {
        return null;
      }

      // Return the component if it exists
      return this.components()[componentName] ?? null;
    });
  }

  /**
   * Disconnect from Q-SYS Core and clean up all state.
   */
  public disconnect(): void {
    // Close the QRWC connection (if it exists)
    this.qrwc?.close();

    // Clear the stored QRWC instance
    this.qrwc = undefined;

    // Update the connection status signal to false
    this.initialised.set(false);

    // Clear all components
    this.components.set({});
  }
}
