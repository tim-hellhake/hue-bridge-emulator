/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

 import { Request, Response } from "express";
 import { HueStorage } from "../hue-storage";

 export const getLights = async (req: Request, res: Response) => {
	res.status(200)
		.contentType('application/json')
		.send("");
 }