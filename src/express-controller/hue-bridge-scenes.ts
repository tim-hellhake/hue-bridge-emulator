/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response } from "express";
import { HueStorageScenes } from "../storage/hue-storage-scenes";
import * as HueResponse from "./hue-response";
import * as Models from '../storage/hue-storage-models';
import { Type as HueErrorType, Description as HueErrorDescr } from "./hue-response";

/**
 * Express controller to create a new scene
 * @param req Express request information. Optionally receives `name`, `lights`, or `lightstates` as body property. Optionally, `type` and `class` can also be provided as body property.
 */
export const newScene = async (req: Request, res: Response) => {
	// get requested group
	let scene = req.body as Models.Scene;
	// new scene
	return HueStorageScenes.shared.addScene(scene)
		.then(newKey => {
			return res.status(200).json(HueResponse.successStructure('id', newKey));
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.InternalError, "/scenes/", HueErrorDescr.InternalError));
		})
}

/**
 * Express controller to get list of scenes
 * @param req Express request information. No special requirements here.
 */
export const getScenes = async (req: Request, res: Response) => {
	// get scenes
	let scenes = HueStorageScenes.shared.getScenes();
	// return success
	return res.status(200).json(scenes);
}

/**
 * Express controller to get a scene by id
 * @param req Express request information. Expects `sceneid` in params property.
 */
export const getScene = async (req: Request, res: Response) => {
	// get parameters
	let sceneid = req.params.sceneid as string;
	// get scene from storage
	let scene = HueStorageScenes.shared.getScene(sceneid);
	if (scene) {
		// return success
		return res.status(200).json(scene);
	} else {
		// return error
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/scenes/'+sceneid, HueErrorDescr.MissingParameter))
	}
}

/**
 * Express controller to set attributes of a scene (e.g. name, lights, or lightstates)
 * @param req Express request information. Expects `sceneid` in params property and optionally `name`, or `lights`, or `lightstates` in body property.
 */
export const setScene = async (req: Request, res: Response) => {
	// get scene id
	let sceneid = req.params.sceneid as string;
	// get new body attributes
	let name = req.body.name as string;
	let lights = req.body.lights as Array<string>;
	let lightstates = req.body.lightstates as { [key: string]: Models.LightState };
	// check inputs
	if (sceneid == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/scenes/'+sceneid, HueErrorDescr.MissingParameter));
	}
	// set group attributes
	return HueStorageScenes.shared.setScene(sceneid, name, lights, lightstates)
		.then(() => {
			// TODO: Return successfully applied attributes
			return res.status(200).json(HueResponse.successStructure("/scenes/"+sceneid, name));
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/scenes/'+sceneid, HueErrorDescr.MissingParameter));
		})
}

/**
 * Express controller to delete a scene
 * @param req Express request information. Expects `sceneid` in params property.
 */
export const deleteScene = async (req: Request, res: Response) => {
	// get scene id
	let sceneid = req.params.sceneid as string;
	if (sceneid == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/scenes/'+sceneid, HueErrorDescr.MissingParameter));
	}
	// delete scene
	return HueStorageScenes.shared.deleteScene(sceneid)
		.then(() => {
			// return success
			return res.status(200).json(HueResponse.success("/scenes/"+sceneid+" deleted"));
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.InternalError, "/scenes/"+sceneid, HueErrorDescr.InternalError));
		})
}