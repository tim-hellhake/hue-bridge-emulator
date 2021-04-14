/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response, NextFunction } from "express";
import * as HueResponse from "../express-controller/hue-response";
import { Type as HueErrorType, Description as HueErrorDescr } from "../express-controller/hue-response";
import { HueStorageConfig } from "../storage/hue-storage-config";

 export const authUser = async (req: Request, res: Response, next: NextFunction) => {
	let user = req.params?.user ?? "";
	if (user && HueStorageConfig.shared.checkUser(user)) { return next(); }
	// return error (unauthorized)
	return res.status(200).json(HueResponse.error(HueErrorType.UnauthorizedUser, '/', HueErrorDescr.UnauthorizedUser));
 }