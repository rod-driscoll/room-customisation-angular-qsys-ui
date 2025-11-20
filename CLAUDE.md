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
│   │   ├── components/
│   │   │   ├── base-page/
│   │   │   ├── cameras-card/
│   │   │   ├── help-card/
│   │   │   ├── home-card/
│   │   │   ├── language-selector/
│   │   │   ├── power-card/
│   │   │   ├── splash-page/
│   │   │   └── volume-control/
│   │   └── services/
│   │       ├── IQrwcControlState.ts
│   │       ├── qrwc-angular-service.ts
│   │       └── qrwc-control-binding.ts
│   └── styles.css
├── public/
│   └── assets/
│       └── images/
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
- Maintains a list of `requiredComponents` that the application needs to function
- Exposes signals for reactive connection state:
  - `initialised` - boolean signal tracking connection status
  - `connectionIpAddress` - signal containing the current connection IP address
  - `components` - signal containing all discovered Q-SYS components
  - `missingComponents` - computed signal that returns an array of missing required components
- Provides `getComputedComponent(name)` helper for component-specific reactivity
- Handles connection lifecycle: connect, disconnect, automatic reconnection on failure
- Displays visual warnings when components are missing from the Q-SYS Core

**QrwcControlBinding** (`src/app/services/qrwc-control-binding.ts`):

- Helper class for creating reactive bindings to individual Q-SYS controls
- Provides lazy computed properties for all control state properties:
  - `value()`, `position()`, `string()`, `legend()`, `bool()`
  - `min()`, `max()`, `values()`
  - `state()` - full control state
  - `connected()` - connection status
- Provides methods to update control values: `setValue()`, `setPosition()`
- Handles automatic subscription and cleanup
- Supports logarithmic scaling for position-based controls
- Single subscription per control, fully self-contained

### Q-SYS Control Binding Pattern

Components that interact with Q-SYS can use two approaches:

**Approach 1: Using QrwcControlBinding (Recommended)**

```typescript
import { QrwcControlBinding } from '../services/qrwc-control-binding';

// Create binding
readonly gainControl = new QrwcControlBinding(
  this.qrwc,
  'MyComponent',
  'gain',
  true  // use logarithmic scaling
);

// Access values reactively
const currentGain = this.gainControl.value();
const isConnected = this.gainControl.connected();

// Update value
this.gainControl.setValue(-6);
```

**Approach 2: Manual Subscription with Effects**

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

Q-SYS component names referenced in code (defined in `QrwcAngularService.requiredComponents`):

- `Room Controls` - Main room control component (power, volume, mute controls)
- `UCI Text Helper` - UCI locale text helper for all UI text and language selection
- `USB Video Bridge Core` - Camera control component
- `HDMISourceSelect_1` - Home page HDMI source selection component

These must match the component names in the Q-SYS Designer file. If any component is missing, the application will display a warning banner listing the missing components.

### Angular Signals and Reactivity

The application uses Angular's modern signals API for reactive state management. When working with Q-SYS controls:

- Use `signal()` for component state
- Use `computed()` for derived values
- Use `effect()` to react to signal changes and set up Q-SYS subscriptions

### Error Handling and Diagnostics

The application provides real-time visual feedback for connection and component issues:

**Connection Status:**
- Red banner displayed when not connected to Q-SYS Core
- Shows the full WebSocket URL being attempted (e.g., `ws://127.0.0.1/qrc-public-api/v0`)
- Displays "Attempting to reconnect..." message
- Automatic reconnection every 5 seconds

**Missing Components Warning:**
- Orange warning banner displayed when connected but required components are missing
- Lists all missing component names in a bulleted list
- Includes helpful message to check the Q-SYS design file
- Only appears when connected (to avoid confusion during connection attempts)

### WebSocket Connection Details

- Protocol: WebSocket (ws://)
- Endpoint: `/qrc-public-api/v0`
- Polling interval: Configurable (default 200ms)
- Automatic reconnection on disconnect
- Connection status tracked via `initialised` signal
- Connection IP tracked via `connectionIpAddress` signal

### Application Components

**Main Pages:**
- `splash-page` - Initial loading screen with logo and splash text
- `base-page` - Main application container with navigation, room name, and card display

**UI Cards (displayed on base-page):**
- `home-card` - HDMI source selection buttons (3 sources)
- `cameras-card` - USB camera control buttons (pan, tilt, zoom)
- `help-card` - Help text and instructions for the room
- `power-card` - System power off confirmation dialog

**Reusable Components:**
- `language-selector` - Language selection dropdown (top-left of all pages)
- `volume-control` - Volume slider with mute button and +/- controls (bottom-right)

Each component is a standalone Angular component with its own `.ts`, `.html`, and `.css` files.

## Notes for AI Assistants

This file provides context about the project structure and conventions to help AI assistants better understand and work with the codebase.

## Instructions for creating base UI

### Layout and aspect

The primary layout is a 16:9 aspect ratio screen of 1920x1080 pixels.
This design needs to be reactive and support different size and aspect ratios.

The layout will be modelled from images in ./public/assets/images/screenshots/

Wherever possible use colors from ./src/style.css

### Text and locale

Most of the text items are bound to the Q-SYS component "UCI Text Helper".

The language selector is a component that is displayed in the top left of all pages, the text displayed is bound to the Q-SYS component "UCI Text Helper" LanguageSelect.String.
When the language selector is pressed display a list of languages as shown in  ./public/assets/images/screenshots/Language selector.png.
The languages to display are contained in LanguageSelect.Choices.

### Images and icons

Whenever icons are used, use the closest matching icons from https://fonts.google.com/icons.
If no matching icons can be found suggest alternatives.

### Pages

a Description of the pages and their contents are as follows:

1. 'Splash page', represented by ./public/assets/images/screenshots/Splash page.png, display this page on load.
   1. The center image is ./public/images/communities-logo.png
   2. When any other part of the splash page is pressed navigate to the base page.
   3. The text at the bottom is bound to the Q-SYS component "UCI Text Helper" SplashText.String.
2. 'Base page', represented by ./public/assets/images/screenshots/Base.png, display this page on load.
   1. Most 'cards' become visible overlaying this page
   2. When the system is powered off then close this page and display the splash page
   3. The text at the bottom left of this page is bound to the Q-SYS component "UCI Text Helper" RoomName.String.
   4. The text at the top centre of this page is the 'Current card'; indexed from the Q-SYS component "UCI Text Helper" PageNames, where the current page is stored in this project.
   5. The icons at the top right are for selecting cards on the base page. Use icons from https://fonts.google.com/icons.
   Pressing each icon will cause a card to display on the base page.
   6. The icons at the top right are as follows
      1. Home
      2. Cameras
      3. Help
      4. Power
   The first 3 icons are mutually exclusive; referenced from the Q-SYS component "UCI Text Helper" PageNames, so when they are pressed the associated card appears and the other cards close, and the 'Current card' text changes to the PageName.
   The 4th icon is power, when it is pressed the Power card is displayed over the top of all other pages.
3. Volume control is at the bottom right of the Base page.
   1. The + symbol is linked to the Q-SYS component "Room Controls" VolumeUpDown[1].Boolean.
   2. The - symbol is linked to the Q-SYS component "Room Controls" VolumeUpDown[2].Boolean.
   3. The microphone symbol is linked to the Q-SYS component "Room Controls" VolumeMute.Boolean.
   4. The bar graph between - and + is linked to the Q-SYS component "Room Controls" VolumeFader.Value.
4. Home card - displayed on the Base page when the Home icon is pressed. The Home card has 3 buttons for video source selection.
   1. The names under the source selection buttons are linked to the Q-SYS component "UCI Text Helper" SourceNames.
   2. The buttons are linked to the Q-SYS component "HDMISourceSelect_1". Pressing each button sets HDMISourceSelect_1[('selector.%0d'):format(index)].Boolean true, where 'index' is a refeernce to which button was pressed starting at zero.
5. Cameras card - displayed on the Base page when the Camera icon is pressed. The buttons on the card are linked to the Q-SYS component "USB Video Bridge Core". Bind the buttons with controls on the component with similar names.
6. Power card - displayed on the Base page when the power icon is pressed.
   1. Link the top text with the Q-SYS component "UCI Text Helper" ShutdownPrompt.String.
   2. The green button is the ShutdownYes button, link it with the Q-SYS component "Room Controls" SystemOff.Boolean. The text on the button is bound to the Q-SYS component "UCI Text Helper" ShutdownYes.String.
   3. The red button is the ShutdownNo button, when pressed close the Power card. The text on the button is bound to the Q-SYS component "UCI Text Helper" ShutdownNo.String.
7. Help card - displayed on the Base page when the help icon is pressed. The text items on this page should be linked with matching items in the Q-SYS component "UCI Text Helper"
