# Hue bridge emulator

[![Build Status](https://travis-ci.org/tim-hellhake/hue-bridge-emulator.svg?branch=master)](https://travis-ci.org/tim-hellhake/hue-bridge-emulator)
[![dependencies](https://david-dm.org/tim-hellhake/hue-bridge-emulator.svg)](https://david-dm.org/tim-hellhake/hue-bridge-emulator)
[![devDependencies](https://david-dm.org/tim-hellhake/hue-bridge-emulator/dev-status.svg)](https://david-dm.org/tim-hellhake/hue-bridge-emulator?type=dev)
[![optionalDependencies](https://david-dm.org/tim-hellhake/hue-bridge-emulator/optional-status.svg)](https://david-dm.org/tim-hellhake/hue-bridge-emulator?type=optional)
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

# How to use
