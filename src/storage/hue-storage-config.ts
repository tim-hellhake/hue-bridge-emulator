/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

 import { HueStorage } from "./hue-storage";

 export class HueStorageConfig extends HueStorage {
	 /** Shared instance of HueStorageConfig for global use */
	static shared: HueStorageConfig = new HueStorageConfig();

	/**
	* Add a new username to the Hue Storage
	* @param name String of the username
	* @returns Promise to confirm the update being written to file
	* @throws If either object could not be parsed (`JSON.stringify`) or file could not be written (`fs.writeFile`)
	*/
	public async addUser(name: string): Promise<void> {
		// check if name already exists
		if (this.storage.whitelist?.includes(name) ?? false) { return }
		// add name
		if (!this.storage.whitelist) { this.storage.whitelist = []; }
		this.storage.whitelist?.push(name); 
		// write to file
		return this.writeStorage(this.storage).catch(console.log);
	}

	/**
	 * Check if username is whitelisted
	 * @param name String of the username
	 * @returns if whitelisted
	 */
	public checkUser(name: string): boolean {
		if (this.storage.whitelist?.includes(name) ?? false) { return true; } 
		return false;
	}
 }