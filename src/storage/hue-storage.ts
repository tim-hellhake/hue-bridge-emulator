/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import fs from 'fs';
import * as Storage from './hue-storage-models';

/**
 * Handles storage feature for Hue emulator. 
 */
export class HueStorage {
	/** Shared instance of HueStorage for global use */
	static shared: HueStorage = new HueStorage();

	/** Handler for asynchronuous file actions */
	readonly fsPromises = fs.promises;
	/** Standard file for Hue storage */
	readonly file = './hue.json';

	/** Storage object for caching */ 
	protected storage: Storage.File = {};
	
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
				fs.writeFileSync(this.file, JSON.stringify({} as Storage.File) as string);
				console.log("Hue storage file '" + this.file + "' created.");
			} else {
				console.log(error);
			}
		}
	}

	/**
	 * Receive full content of a file as T object
	 * @param file File to read
	 * @param encoding Encoding to be used for reading
	 * @returns Promise of T object
	 * @throws If either file could not be found/read (`fs.readFile`) or JSON string could not parsed (`JSON.parse`)
	 */
	protected async getFilecontent<T>(file: string, encoding: BufferEncoding = 'utf8'): Promise<T> {
		// read file
		const jsonString = await this.fsPromises.readFile(file, encoding);
		return JSON.parse(jsonString) as T;
	}

	/**
	 * Overwrites content T object into a file
	 * @param file File to write
	 * @param content T object
	 * @param encoding Encoding to be used for writing
	 * @returns Promise to verify content being written
	 * @throws If either object could not be parsed (`JSON.stringify`) or file could not be written (`fs.writeFile`)
	 */
	protected async writeFilecontent<T>(file: string, content: T, encoding: BufferEncoding = 'utf8'): Promise<void> {
		const jsonString = JSON.stringify(content) as string;
		return await this.fsPromises.writeFile(file, jsonString, { flag: 'w', encoding: encoding });
	}

	/**
	 * Receive full content of Hue Storage asynchronuously as Storage object
	 * @returns Promise of storage object
	 * @throws If either file could not be found/read (`fs.readFile`) or JSON string could not parsed (`JSON.parse`)
	 */
	protected async getStorage(): Promise<Storage.File> {
		return this.getFilecontent(this.file);
	}

	/**
	 * Overwrites content Storage object into the Storage file
	 * @param storage Storage object to be overwritten to file
	 * @returns Promise to verify content being written
	 * @throws If either object could not be parsed (`JSON.stringify`) or file could not be written (`fs.writeFile`)
	*/
	protected async writeStorage(storage: Storage.File): Promise<void> {
		return this.writeFilecontent(this.file, storage);
	}
}