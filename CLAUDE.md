# Room Customisation Angular Qsys UI

## Project Overview

This is an Angular-based user interface for room customization with Qsys integration using Q-SYS QRWC (Q-SYS Remote Web Control) that connects to a Q-SYS Core via WebSocket and controls components that exist in the Qsys design.

## Project Structure

```
room-customisation-angular-qsys-ui/
├── src/
│   ├── app/
│   │   ├── app.html
│   │   ├── app.ts
│   │   └── services/
│   └── styles.css
├── package.json
├── package-lock.json
└── README.md
```

## Key Technologies

- Angular 20.3.3 (standalone components)
- TypeScript with strict mode enabled
- SCSS for styling
- `@q-sys/qrwc` (version 0.5.0-beta) - Q-SYS WebSocket communication library
- Karma/Jasmine for testing

## Common Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:4200)
ng serve
# or
npm start

# Build for production
ng build

# Build and watch for changes (development mode)
ng build --watch --configuration development
# or
npm run watch

# Run unit tests
ng test
# or
npm test

# Generate a new component
ng generate component component-name

# Generate other schematics (directive, pipe, service, etc.)
ng generate --help
```

## Getting Started

[Add setup instructions here]

## Development

[Add development workflow here]

## Architecture Overview

### Q-SYS QRWC Integration

This application demonstrates integration with Q-SYS audio/video control systems using the QRWC library:

1. **WebSocket Connection**: Establishes a WebSocket connection to Q-SYS Core's public API at `ws://{ipAddress}/qrc-public-api/v0`
2. **Component Discovery**: Automatically discovers Q-SYS components (like "Pink_Noise_Generator" or "Status") exposed by the Core
3. **Reactive Control**: Uses Angular signals to maintain bidirectional synchronization between Q-SYS controls and the UI
4. **Automatic Reconnection**: Built-in reconnection logic with 5-second retry intervals

**Configuration:**

- Default Core IP: `127.0.0.1` (configured in `src/app/app.ts:25`)
- Can be overridden via URL query parameter: `?host=127.0.0.1`
- Default polling interval: 200ms (configurable via `?poll=500`)

### Core Service Pattern

**QrwcAngularService** (`src/app/services/qrwc-angular-service.ts`):

- Singleton service (`providedIn: 'root'`) managing the QRWC connection
- Exposes signals for reactive connection state:
  - `initialised` - boolean signal tracking connection status
  - `components` - signal containing all discovered Q-SYS components
- Provides `getComputedComponent(name)` helper for component-specific reactivity
- Handles connection lifecycle: connect, disconnect, automatic reconnection on failure

### Q-SYS Control Binding Pattern

Components that interact with Q-SYS follow this pattern:

1. **Inject the service**: `readonly qrwc = inject(QrwcAngularService);`
2. **Create signals for control state**: `readonly mute = signal(false);`
3. **Use Angular effect to watch for component availability**:

   ```typescript
   effect(() => {
     const component = this.qrwc.components()?.[this.componentName];
     if (!component) return;

     // Get control reference
     const control = component.controls['control_name'];

     // Initialize signal with current value
     this.signal.set(control.state.Bool ?? false);

     // Subscribe to updates
     control.on('update', (state) => {
       this.signal.set(state.Bool ?? false);
     });
   });
   ```

4. **Send updates back to Q-SYS**: `control.update(newValue);`

## TypeScript Configuration

The project uses **strict TypeScript configuration**:

- `strict: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `strictTemplates: true` (Angular templates)

All new code must adhere to these strict type checks.

## Q-SYS Design File

The [Room Customization Reference.qsys](https://github.com/Q-SYS-Communities-for-Developers/System-Customization/blob/main/Room%20Customization%20Reference.qsys) file is the Q-SYS Designer project that this web application connects to. It must be running on a Q-SYS Core for the application to function properly.

## Development Notes

### Running with Q-SYS Core

1. Ensure the Q-SYS Designer file is loaded on a Core
2. Verify the Core's IP address matches the configuration
3. Start the Angular dev server: `ng serve`
4. Navigate to `http://localhost:4200` (optionally with `?host=YOUR_CORE_IP`)

### Component Naming

Q-SYS component names referenced in code:

- `Status` - Core status component
- `Room Controls` - Room control component

These must match the component names in the Q-SYS Designer file.

### Angular Signals and Reactivity

The application uses Angular's modern signals API for reactive state management. When working with Q-SYS controls:

- Use `signal()` for component state
- Use `computed()` for derived values
- Use `effect()` to react to signal changes and set up Q-SYS subscriptions

### WebSocket Connection Details

- Protocol: WebSocket (ws://)
- Endpoint: `/qrc-public-api/v0`
- Polling interval: Configurable (default 200ms)
- Automatic reconnection on disconnect

## Notes for AI Assistants

This file provides context about the project structure and conventions to help AI assistants better understand and work with the codebase.
