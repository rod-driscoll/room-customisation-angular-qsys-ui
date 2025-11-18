# RoomCustomisationAngularQsysUi

This project is an HTML user interface for the Q-SYS [Room Customisation Tutorial](https://github.com/Q-SYS-Communities-for-Developers/System-Customization) example.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Dependecies

```bash
npm update
npm install @q-sys/qrwc
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Comm Reference](https://angular.dev/tools/cli) page.

## Requirements

1. Download [Room Customization Reference.qsys](https://github.com/Q-SYS-Communities-for-Developers/System-Customization/blob/main/Room%20Customization%20Reference.qsys) and open using [Q-SYS Designer](https://www.qsys.com/resources/software-and-firmware/q-sys-designer-software/) v10.0.1 or later.
2. Save the qsys file to update it to v10.0 or later to use a version that supports websockets.
3. Load the file onto a Qsys core.
4. Browse to the embedded web page on the core, select Network > Services, then the 'Management' tab, and enable 'Q-SYS Remote WebSocket Control'
5. Using Qsys administrator on the running Qsys core make sure that there is no QRC PIN.
   1. Select Users > Guest > Access Permissions > External Control Protocol > Yes.
   2. This should not be necessary when QRWC is no longer BETA.
6. Enter the address of the core or the address of the PC running emulation mode into either:
   1. app.ts
    `readonly coreIpAddress = '<core-address>';`
   2. using query parameters in the host url.
    `http://<host-address>?host=<core-address>`

## Authors

* Rod Driscoll <rod@theavitgroup.com.au>

## Version History

* 1.0
  * Initial release

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgements

* Thank you to Hope Roth <https://github.com/qsc-hoperoth> and [Q-SYS](www.qsys.com) for creating the Room Customisation Demo project.
