/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response } from "express";
import { HueResponseDefaults } from "./hue-response";
import { HueStorage } from "./hue-storage";


export const createUser = async (req: Request, res: Response) => {
	// devicetype parameter
	if (req.body.devicetype) {
		// create new username
		const username = randomString(29, '0123456789abcdefghijklmnopqrstuvwxyz');
		HueStorage.shared.addUser(username)
			.then(() => {
				res.status(200)
					.contentType('application/json')
					.send(JSON.stringify(HueResponseDefaults.successUsername(username)));
			})
	} else {
		// report missing body
		res.status(200)
			.contentType('application/json')
			.send(JSON.stringify(HueResponseDefaults.errorMissingParameters()));
	}
}

function randomString(length: number, chars: string) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}