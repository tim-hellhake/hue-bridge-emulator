/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response } from "express";
import * as HueResponse from "./hue-response";
import { Type as HueErrorType, Description as HueErrorDescr } from "./hue-response";
import { HueStorageLights } from "../storage/hue-storage-lights";
import * as Models from '../storage/hue-storage-models';
import * as Timehelper from '../helpers/timehelper';

let lastScan: string = Timehelper.getIsoDateTime();
let lastFoundLight: Models.Light;

/**
 * Express controller to search for new lights
 * @param req Express request information. No special requirements here.
 */
export const searchNewLights = async (req: Request, res: Response) => {
	// get current date
	lastScan = Timehelper.getIsoDateTime();
	// get new random light
	lastFoundLight = await HueStorageLights.shared.newRandomLight();
	// return success
	return res.status(200).json(HueResponse.successStructure('/lights', 'Searching for new devices'));
}

/**
 * Express controller to add a new light that has been randomly created with `searchNewLights`.
 * @param req Express request information. No special requirements here.
 */
export const getNewLights = async (req: Request, res: Response) => {
	// add new light to storage
	if (lastFoundLight) {
		let key = await HueStorageLights.shared.addLight(lastFoundLight);
		let jsonSuccess: {[key: string]: {name: string} | string } = {};
		jsonSuccess[key] = {name: lastFoundLight.name};
		jsonSuccess["lastscan"] = lastScan;
		// return success
		return res.status(200).json(jsonSuccess);
	} 
	// return success, but without new lights
	return res.status(200).json({ "lastscan": lastScan });
}

/**
 * Express controller to get list of lights
 * @param req Express request information. No special requirements here.
 */
export const getLights = async (req: Request, res: Response) => {
	// get lights
	let lights = HueStorageLights.shared.getLights();
	// return success
	return res.status(200).json(lights);
}

/**
 * Express controller to get a light by id
 * @param req Express request information. Expects `lightid` in params property.
 */
export const getLight = async (req: Request, res: Response) => {
	// get parameters
	let lightid = req.params.lightid as string;
	// get light from storage
	let light = HueStorageLights.shared.getLight(lightid);
	if (light) {
		// return success
		return res.status(200).json(light);
	} else {
		// return error
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/lights/'+lightid, HueErrorDescr.MissingParameter))
	}
}

/**
 * Express controller to set attributes of a light (e.g. name)
 * @param req Express request information. Expects `lightid` in params property and `name` in body property.
 */
export const setLight = async (req: Request, res: Response) => {
	// get light id
	let lightid = req.params.lightid as string;
	// get new name
	let name = req.body.name as string;
	// check inputs
	if (lightid == undefined || name == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/lights/'+lightid, HueErrorDescr.MissingParameter));
	}
	// set light name
	return HueStorageLights.shared.setLight(lightid, name)
		.then(() => {
			// return success
			return res.status(200).json(HueResponse.successStructure("/lights/"+lightid+"/name", name));
		})
		.catch(error => {
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/lights/'+lightid, HueErrorDescr.MissingParameter));
		})
}

/**
 * Express controller to set light state
 * @param req Express request information. Expects `lightid` in params property and the body property being conform to `Models.LightState`.
 */
export const setLightState = async (req: Request, res: Response) => {
	// get light id
	let lightid = req.params.lightid as string;
	// get requested light state
	let lightstate = req.body as Models.LightState;
	if (lightid == undefined || lightstate == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/lights/'+lightid, HueErrorDescr.MissingParameter));
	}
	// set light state
	return HueStorageLights.shared.setLightState(lightid, lightstate)
		.then(() => {
			// TODO: Return successfully applied states
			return res.status(200).json();
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.InternalError, "/lights/"+lightid, HueErrorDescr.InternalError));
		})
}

/**
 * Express controller to delete a light
 * @param req Express request information. Expects `lightid` in params property.
 */
export const deleteLight = async (req: Request, res: Response) => {
	// get light id
	let lightid = req.params.lightid as string;
	if (lightid == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/lights/'+lightid, HueErrorDescr.MissingParameter));
	}
	// delete light
	return HueStorageLights.shared.deleteLight(lightid)
		.then(() => {
			// return success
			return res.status(200).json(HueResponse.success("/lights/"+lightid+" deleted"));
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.InternalError, "/lights/"+lightid, HueErrorDescr.InternalError));
		})
}