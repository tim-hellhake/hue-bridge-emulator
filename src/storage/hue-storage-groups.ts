/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

 import { HueStorage } from "./hue-storage";
 import { HueStorageErrors } from "./hue-storage-errors";
 import * as Models from './hue-storage-models';

 export class HueStorageGroups extends HueStorage {
	static shared: HueStorageGroups = new HueStorageGroups();

	/**
	 * Get all registered groups from the Hue Storage
	 * @returns Key-value pairs of all groups, whereas the key represents the group id
	 */
	public getGroups(): { [key: string]: Models.Group } {
	 return this.storage.groups ?? {};
	}

	/**
	 * Get a registered group from the Hue Storage
	 * @param id Group id of the group
	 * @returns Group object
	 */
	public getGroup(id: string): Models.Group | undefined {
	 return this.storage.groups?.[id];
	}

	/**
	 * Add a ne wgroup to the Hue Storage
	 * @param group Object of the group
	 * @returns Promise to confirm the update being written to file and to return the group key
	 */
	public async addGroup(group: Models.Group): Promise<string> {
	// get all existing group ids
	let keys = Object.keys(this.storage.groups ?? []);
	let numberKeys = keys.map(x => parseInt(x));
	// new key
	let newKey = numberKeys.length > 0 ? String(Math.max(...numberKeys) + 1) : '0';
	// add group
	if (!this.storage.groups) { this.storage.groups = {}; }
	this.storage.groups[newKey] = group;
	console.log('Added new group with key "' + newKey + '"');
	// write to file
	return this.writeStorage(this.storage)
		.then(() => {
			return newKey;
		})
		.catch(error => {
			return Promise.reject(new HueStorageErrors.WriteStorage(error));
		});	
	}

	/**
	 * Set group attributes
	 * @param id Id of the group
	 * @param name Optional: New name of the group
	 * @param lights Optional: New array of lights mapped to the group
	 * @param groupclass Optional: New group class
	 * @returns Promise to confirm the update being written to file
	 */
	public async setGroup(id: string, name?: string, lights?: Array<string>, groupclass?: string): Promise<void> {
		// get group object
		let group = this.storage.groups?.[id];
		if (group) {
			// set group object
			if (name) { group.name = name; }
			if (lights) { group.lights = lights; }
			if (groupclass) { group.class = groupclass; }
			// write to file
			return this.writeStorage(this.storage)
				.catch(error => {
					return Promise.reject(new HueStorageErrors.WriteStorage(error));
				});	
		} else {
			return Promise.reject(new HueStorageErrors.GroupNotFound('Group id ' + id + ' has not been found'));
		}
	}

	/**
	 * Set group actions
	 * @param id Id of the group
	 * @param action New action properties to be applied to the group object
	 * @returns Promise to confirm the update being written to file
	 */
	public async setGroupAction(id: string, action: Models.GroupAction): Promise<void> {
		// get group object
		let group = this.storage.groups?.[id] as Models.Group;
		if (group) {
			if (!group.action) { group.action = {}; }
			// set actions
			group.action.on = action.on;
			group.action.bri = action.bri;
			group.action.hue = action.hue;
			group.action.sat = action.sat;
			group.action.xy = action.xy;
			group.action.ct = action.ct;
			// write to file
			return this.writeStorage(this.storage)
				.catch(error => {
					return Promise.reject(new HueStorageErrors.WriteStorage(error));
				});	
		} else {
			return Promise.reject(new HueStorageErrors.GroupNotFound('Group id ' + id + ' has not been found'));
		}
	}

	/**
	 * Delete group element
	 * @param id Id of the group
	 * @returns Promise to confirm the update being written to file 
	 */
	public async deleteGroup(id: string): Promise<void> {
		// get light object
		if (!this.storage.groups) { this.storage.groups = {}; }
		// delete element
		delete this.storage.groups[id];
		// write to file
		return this.writeStorage(this.storage)
			.catch(error => {
				return Promise.reject(new HueStorageErrors.WriteStorage(error));
			});	
	}
 }