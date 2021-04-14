/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, response, Response } from "express";
import { HueStorageGroups } from "../storage/hue-storage-groups";
import * as HueResponse from "./hue-response";
import * as Models from '../storage/hue-storage-models';
import { Type as HueErrorType, Description as HueErrorDescr } from "./hue-response";

/**
 * Express controller to create a new group
 * @param req Express request information. Expects `name`, or `lights` as body property. Optionally, `type` and `class` can also be provided as body property.
 */
 export const newGroup = async (req: Request, res: Response) => {
	// get requested group
	let request = req.body as Models.Group;
	// set attributes
	let group = {} as Models.Group;
	group.name = request.name ?? "Group";
	group.lights = request.lights ?? [];
	group.type = request.type ?? "LightGroup";
	group.class = request.class ?? "Other";
	// default attributes
	group.sensors = [];
	group.state = { "all_on": false, "any_on": false } as Models.GroupState;
	group.recycle = false;
	group.action = { "on": false, "alert": "none" } as Models.GroupAction;
	// new group
	return HueStorageGroups.shared.addGroup(group)
		.then(newKey => {
			return res.status(200).json(HueResponse.successStructure('id', newKey));
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.InternalError, "/groups/", HueErrorDescr.InternalError));
		})
}

/**
 * Express controller to get list of groups
 * @param req Express request information. No special requirements here.
 */
export const getGroups = async (req: Request, res: Response) => {
	// get groups
	let groups = HueStorageGroups.shared.getGroups();
	// return success
	return res.status(200).json(groups);
}

/**
 * Express controller to get a group by id
 * @param req Express request information. Expects `groupid` in params property.
 */
 export const getGroup = async (req: Request, res: Response) => {
	// get parameters
	let groupid = req.params.groupid as string;
	// get group from storage
	let group = HueStorageGroups.shared.getGroup(groupid);
	if (group) {
		// return success
		return res.status(200).json(group);
	} else {
		// return error
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/groups/'+groupid, HueErrorDescr.MissingParameter))
	}
}

/**
 * Express controller to set attributes of a group (e.g. name, lights, or class)
 * @param req Express request information. Expects `groupid` in params property and `name`, or `lights`, or `class` in body property.
 */
export const setGroup = async (req: Request, res: Response) => {
	// get group id
	let groupid = req.params.groupid as string;
	// get new body attributes
	let name = req.body.name as string;
	let lights = req.body.lights as Array<string>;
	let groupClass = req.body.class as string;
	// check inputs
	if (groupid == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/groups/'+groupid, HueErrorDescr.MissingParameter));
	}
	// set group attributes
	return HueStorageGroups.shared.setGroup(groupid, name, lights, groupClass)
		.then(() => {
			// TODO: Return successfully applied attributes
			return res.status(200).json(HueResponse.successStructure("/groups/"+groupid, name));
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/groups/'+groupid, HueErrorDescr.MissingParameter));
		})
}

/**
 * Express controller to set group action
 * @param req Express request information. Expects `groupid` in params property and the body property being conform to `Models.GroupState`.
 */
 export const setGroupAction = async (req: Request, res: Response) => {
	// get group id
	let groupid = req.params.groupid as string;
	// get requested group action
	let action = req.body as Models.GroupAction;
	if (groupid == undefined || action == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/groups/'+groupid, HueErrorDescr.MissingParameter));
	}
	// set group action
	return HueStorageGroups.shared.setGroupAction(groupid, action)
		.then(() => {
			// TODO: Return successfully applied actions
			return res.status(200).json();
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.InternalError, "/groups/"+groupid, HueErrorDescr.InternalError));
		})
}

/**
 * Express controller to delete a group
 * @param req Express request information. Expects `groupid` in params property.
 */
export const deleteGroup = async (req: Request, res: Response) => {
	// get group id
	let groupid = req.params.groupid as string;
	if (groupid == undefined) {
		return res.status(200).json(HueResponse.error(HueErrorType.MissingParameter, '/groups/'+groupid, HueErrorDescr.MissingParameter));
	}
	// delete group
	return HueStorageGroups.shared.deleteGroup(groupid)
		.then(() => {
			// return success
			return res.status(200).json(HueResponse.success("/groups/"+groupid+" deleted"));
		})
		.catch(error => {
			console.log(error);
			// return error
			return res.status(200).json(HueResponse.error(HueErrorType.InternalError, "/groups/"+groupid, HueErrorDescr.InternalError));
		})
}