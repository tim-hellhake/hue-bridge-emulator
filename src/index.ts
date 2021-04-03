/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

export * from './hue-bridge-emulator';

import HueBridgeEmulator from './hue-bridge-emulator';

//const { HueBridgeEmulator } = require('../dist/index.js');

// const hueBridgeEmulator = new HueBridgeEmulator({ port: 80, debug: true });
let hueBridgeEmulator = new HueBridgeEmulator({ debug: true });
hueBridgeEmulator.start();
hueBridgeEmulator.addLight('light1');