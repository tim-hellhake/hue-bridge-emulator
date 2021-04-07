/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import fs from 'fs';

/** Interface for Hue storage file */
interface StorageFile {
	/** Users being whitelisted on the Hue bridge */
	whitelist?: Array<string>;
}

/**
 * Handles storage feature for Hue emulator. 
 */
export class HueStorage {
	/** Shared instance of HueStorage for global use */
	static shared: HueStorage = new HueStorage();

	/** Handler for asynchronuous file actions */
	private fsPromises = fs.promises;
	/** Standard file for Hue storage */
	private file = './hue.json';

	/** Storage object for caching */ 
	private storage: StorageFile = {};

	/**
	 * Init HueStorage: 
	 * - Handle file storage initialization synchronuously
	 */
	constructor() {
		try {
			// read Hue storage file and load into cache
			let jsonString = fs.readFileSync(this.file, 'utf8');
			let storage = JSON.parse(jsonString);
			if (storage) { this.storage = storage; }
		} catch(error) {
			if (error.code == 'ENOENT') {
				// create storage file if not existing yet
				console.log("Create a Hue storage file '" + this.file + "'");
				fs.writeFileSync(this.file, JSON.stringify({} as StorageFile) as string);
				console.log("Hue storage file '" + this.file + "' created.");
			} else {
				console.log(error);
			}
		}
	}

	/**
	 * Receive full content of Hue Storage asynchronuously as Storage object
	 * @returns Promise of storage object
	 * @throws If either file could not be found/read (`fs.readFile`) or JSON string could not parsed (`JSON.parse`)
	 */
	protected async getStorage(): Promise<StorageFile> {
		// read file
		return this.fsPromises.readFile(this.file, 'utf8') 
			.then(jsonString => {
				// and parse JSON string to Storage object
				return JSON.parse(jsonString) as StorageFile;
			})
	}

	/**
	 * Overwrites content Storage object into the Storage file
	 * @param storage Storage object to be overwritten to file
	 * @returns Promise to verify content being written
	 * @throws If either object could not be parsed (`JSON.stringify`) or file could not be written (`fs.writeFile`)
	*/
	protected async writeStorage(storage: StorageFile): Promise<void> {
		return Promise.resolve(storage)
			.then(storage => {
				// stringify from Storage object to JSON string
				return JSON.stringify(storage) as string;
			})
			.then(jsonString => {
				// and write to file (overwrite 'w')
				return this.fsPromises.writeFile(this.file, jsonString, { flag: 'w', encoding: 'utf8' });
			})
	}

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
		if (!this.storage.whitelist) { this.storage.whitelist = [name]; }
		else { this.storage.whitelist?.push(name); }
		// write to file
		return this.writeStorage(this.storage)
			.catch(console.log);
	}
}