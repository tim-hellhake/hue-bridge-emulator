# Hue bridge emulator

[![license](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)

Node.js server to emulate a Philips Hue Bridge.

This projects helps all developers for the Hue Bridge to simulate interactions with a Hue Bridge without even owning one.

# How to compile
As the app is written in Typescript, the code needs to be compiled into the `dist` folder first.
The instructions below requires [`node`](https://nodejs.org/en/download/) being installed on your developer machine.
1. Fork/download the source code into the local folder of your choice
2. Open a Terminal and navigate to that root folder
3. Initiate the Node package environment with: `npm install`
4. The `package.json` has some script pre-configured to start right away with: `npm start dev` (development environment)

# Implementation plan
- [x] Permanent storage (local JSON file to permanently store the bridge state)
- [x] Lights API
- [x] Groups API
- [ ] Scenes API
- [ ] Error handler to provide proper feedback on wrong JSON body data
