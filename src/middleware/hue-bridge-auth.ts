/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response, NextFunction } from "express";
import { HueStorage } from "../hue-storage";
import { HueResponseDefaults } from "../hue-response";

 export const authUser = async (req: Request, res: Response, next: NextFunction) => {
	let user = req.params?.user ?? "";
	if (user && HueStorage.shared.checkUser(user)) { return next(); }

	return res.status(200)
		.json(HueResponseDefaults.errorUnauthorized('/'));
 }