# RoomCustomisationAngularQsysUi

This project is an HTML user interface for the Q-SYS [Room Customisation Tutorial](https://github.com/Q-SYS-Communities-for-Developers/System-Customization) example, originally posted at [Communities post](https://developers.qsc.com/s/feed/0D5TO00000UuppN0AR).

Source code repository: [room-customisation-angular-qsys-ui](https://github.com/rod-driscoll/room-customisation-angular-qsys-ui)

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

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Comm Reference](https://angular.dev/tools/cli) page.

## Requirements

You will need a Q-Sys core, Q-Sys Designer in emulation mode will not accept websockets :(

1. Download [Room Customization Reference.qsys](https://github.com/Q-SYS-Communities-for-Developers/System-Customization/blob/main/Room%20Customization%20Reference.qsys) and open using [Q-SYS Designer](https://www.qsys.com/resources/software-and-firmware/q-sys-designer-software/) v10.0.1 or later.
2. Save the QSys file to update it to v10.0 or later to use a version that supports websockets.
3. Load the file onto a Qsys core (update the core name in the program to match your core).
4. Browse to the embedded web page on the core, select Network > Services, then the 'Management' tab, and enable 'Q-SYS Remote WebSocket Control'
5. Using Qsys administrator on the running Qsys core make sure that there is no QRC PIN.
   1. Select Users > Guest > Access Permissions > External Control Protocol > Yes.
   2. This should not be necessary when QRWC is no longer BETA.
6. Enter the address of the core or the address of the PC running emulation mode into either:
   1. app.ts
    `readonly coreIpAddress = '<core-address>';`
   2. using query parameters in the host url.
    `http://<host-address>?host=<core-address>`

### Required changes to the Q-SYS Room customisation project

To make the project work the following needs to be done to [Room Customization Reference.qsys](https://github.com/Q-SYS-Communities-for-Developers/System-Customization/blob/main/Room%20Customization%20Reference.qsys) after pulling it from the repo.

1. Change the code script access of the USB camera object to 'External' or 'All'.
2. Change the code script access of the 'UCI Text Helper' object to 'All'.
3. Change the code script access of the 'USB Video Bridge Core' object to 'All'.
4. Add a router and give it External Script Access ID 'HDMISourceSelect_1'
   1. I did not test on a NV32 so the HDMI IO Core was not available, therefore I added the router which is more portable

### Background

This was created as an exercise to develop skills in HTML, CSS, Angular, QRWC and an AI assistant.
[Claude code](https://www.claude.com/product/claude-code) was used as an AI assistant (first time ever) and lessons were learnt.
To provide an idea of how much knowledge / skill you's need to be able to re-create this project here is some information on my skill level and experience in web app development.

I started with very little experience having only create a couple of very basic web apps using [Svelte](https://svelte.dev/), and very little success using AI assistants for software development.

- From no experience with [Angular](https://angular.dev/) I did the [First App](https://angular.dev/tutorials/first-app) and [Lear Signals](https://angular.dev/tutorials/signals) tutorials.
- Went through [Q-SYS-UK-Dev-Summit-2025_HTML5-Workshop](https://github.com/ColinHasted/Q-SYS-UK-Dev-Summit-2025_HTML5-Workshop-Student) and completed all the TODOs, this is why I learnt Angular.
- Started this project manually by creating a fresh angula project using `ng new room-customisation-angular-qsys-ui'.
- Copied app.ts and the ./src/app/services/ folder and it's contents from the UK workshop demo.
- Modified it until I had a working qrwc connection to a core on a blank page.
- Copied the styles.css and images out of the qsys project assets, and commented out all the qsys only css commands.
- Using Q-Sys Designer took screen shots of all the UCI pages and put them into ./public/assets/image/screenshots/
- Created CLAUDE.md and spent about 6 hours writing detailed requirements.
- Asked Claude code to generate the project using the CLAUDE.md file.
- What Claude created was extremely underwhelming, nothing worked and the pages didn't look anything like the screenshots I'd provided.
   - Lesson 1: AI tutorials lie, Claude is no good at creating a web page when shown a screen shot.
- Claude had created all the Angular components required so each one needed to be worked on.
   - Lesson 2: Claude is terrible at lining up divs and flex boxes, this was by far the most time consumong task.
   - Lesson 3: Claude is amazingly good at making the Angular objects work and linking the qrwc components with the visual components.

In future I would not be worried about switching front end frameworks, getting the CSS is much harder, although the css doesn't change with the framework so is re-useable.

## Authors

* [Rod Driscoll](https://github.com/rod-driscoll)

## Acknowledgements

Thank you to:
* [Hope Roth](https://github.com/qsc-hoperoth) and [Q-SYS](www.qsys.com) 
  * for creating the Room Customisation Demo project.
* [Colin Hasted](https://github.com/ColinHasted) 
  * for creating [Q-SYS-UK-Dev-Summit-2025_HTML5-Showcase](https://github.com/ColinHasted/Q-SYS-UK-Dev-Summit-2025_HTML5-Showcase) which was referenced to get the initial QRWC Angular connection working.

## Version History

* 1.0.0
  * Initial release

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
