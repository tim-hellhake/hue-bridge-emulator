/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response } from "express";
import * as HueResponse from "./hue-response";
import { Type as HueErrorType, Description as HueErrorDescr } from "./hue-response";
import * as Randomizers from '../helpers/randomizers';
import { HueStorageConfig } from "../storage/hue-storage-config";

/**
 * Express controller to create a new user
 * @param req Express request information. Expects `devicetype` in body property.
 */
export const createUser = async (req: Request, res: Response) => {
	// devicetype parameter
	if (req.body.devicetype) {
		// create new username
		const username = Randomizers.randomString(29, '0123456789abcdefghijklmnopqrstuvwxyz');
		await HueStorageConfig.shared.addUser(username);
		// return result
		return res.status(200).json(HueResponse.successStructure('username', username));
	} else {
		// report missing body
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/', HueErrorDescr.MissingParameter))
	}
}