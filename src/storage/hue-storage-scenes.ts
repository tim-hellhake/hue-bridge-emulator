/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Randomizers from "../helpers/randomizers";
import { HueStorage } from "./hue-storage";
import { HueStorageErrors } from "./hue-storage-errors";
import * as Models from './hue-storage-models';

export class HueStorageScenes extends HueStorage {
	/** Shared instance of HueStorageScenes for global use */
	static shared: HueStorageScenes = new HueStorageScenes();

	/**
	 * Add a new scene to the Hue Storage
	 * @param scene Object of the scene
	 * @returns Promise to confirm the update being written to file and to return the scene key
	 */
	public async addScene(scene: Models.Scene): Promise<string> {
		// new key
		let newKey = this.getRandomUniqueid();
		// add scene
		if (!this.storage.scenes) { this.storage.scenes = {}; }
		this.storage.scenes[newKey] = scene;
		console.log('Added new scene with key "' + newKey + '"');
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
	 * Set scene attributes
	 * @param id Id of the Scene
	 * @param name Optional: New name of the scene
	 * @param lights Optional: New array of lights mapped to the scene
	 * @param lightstates Optional: New/updated elements of the light states
	 * @returns Promise to confirm the update being written to file
	 */
	public async setScene(id: string, name?: string, lights?: Array<string>, lightstates?: { [key: string]: Models.LightState }): Promise<void> {
		// get scene object
		let scene = this.storage.scenes?.[id];
		if (scene) {
			// set scene object
			if (name) { scene.name = name; }
			if (lights) { scene.lights = lights; }
			if (lightstates) { 
				if (!scene.lightstates) { scene.lightstates = {}; }
				let scenelightstate = scene.lightstates;
				Object.keys(lightstates).forEach(key => {
					scenelightstate[key] = lightstates[key];
				}) 
			};
			// write to file
			return this.writeStorage(this.storage)
				.catch(error => {
					return Promise.reject(new HueStorageErrors.WriteStorage(error));
				});	
		} else {
			return Promise.reject(new HueStorageErrors.SceneNotFound('Scene id ' + id + ' has not been found'));
		}
	}

	/**
	 * Get all registered scenes from Hue Storage
	 * @returns Key-value pairs of all scenes, whereas the key represents the scene id
	 */
	public getScenes(): { [key: string]: Models.Scene } {
		return this.storage.scenes ?? {};
	}

	/**
	 * Get a registered scene from Hue Storage
	 * @param id Scene id of the Scene
	 * @returns Scene object
	 */
	public getScene(id: string): Models.Scene | undefined {
		return this.storage.scenes?.[id];
	}

	/**
	 * Delete scene element
	 * @param id Id of the scene
	 * @returns Promise to confirm the update being written to file 
	 */
	public async deleteScene(id: string): Promise<void> {
		// get scene object
		if (!this.storage.scenes) { this.storage.scenes = {}; }
		// delete element
		delete this.storage.scenes[id];
		// write to file
		return this.writeStorage(this.storage)
			.catch(error => {
				return Promise.reject(new HueStorageErrors.WriteStorage(error));
			});	
	}

	/** Generate unique identifier in the format of "3T2SvsxvwteNNys" */
	private getRandomUniqueid(): string {
		return Randomizers.randomString(15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-');
	}
}