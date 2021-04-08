/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { HueStorage } from "./hue-storage";
import { HueStorageErrors } from "./hue-storage-errors";
import * as Models from './hue-storage-models';
import * as Randomizers from '../helpers/randomizers';

export class HueStorageLights extends HueStorage {
	/** Shared instance of HueStorageLights for global use */
	static shared: HueStorageLights = new HueStorageLights();

	readonly templateFile = './src/storage/templates/lights.json';

	/**
	 * Add a newe light to the Hue Storage
	 * @param light Object of the light
	 * @returns Promise to confirm the update being written to file and returns the light key
	 */
	public async addLight(light: Models.Light): Promise<string> {
		// get all existing light ids
		let keys = Object.keys(this.storage.lights ?? []);
		let numberKeys = keys.map(x => parseInt(x));
		// new key
		let newKey = numberKeys.length > 0 ? String(Math.max(...numberKeys) + 1) : '0';
		// add light
		if (!this.storage.lights) { this.storage.lights = {}; }
		this.storage.lights[newKey] = light;
		console.log('Added new light with key "' + newKey + '"');
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
	 * Get all registered lights from Hue Storage
	 * @returns Key-value pairs of all lights, whereas the key represents the light ids
	 */
	public getLights(): { [key: string]: Models.Light } {
		return this.storage.lights ?? {};
	}

	/**
	 * Get a registered light from Hue Storage
	 * @param id Light id of the light
	 * @returns Light object
	 */
	public getLight(id: string): Models.Light | undefined {
		return this.storage.lights?.[id];
	}

	/**
	 * Set light attribute (name)
	 * @param id Light id of the light
	 * @param name Name of the light
	 * @returns Promise to confirm the update being written to file
	 */
	public async setLight(id: string, name: string): Promise<void> {
		// get light object
		let light = this.storage.lights?.[id];
		if (light) {
			// set light object
			light.name = name;
			// write to file
			return this.writeStorage(this.storage)
				.catch(error => {
					return Promise.reject(new HueStorageErrors.WriteStorage(error));
				});	
		} else {
			return Promise.reject(new HueStorageErrors.LightNotFound('Light id '+id+ ' has not been found'));
		}
	}

	/**
	 * Set light state
	 * @param id Id of the light
	 * @returns Promise to confirm the update being written to file
	 */
	public async setLightState(id: string, state: Models.LightState): Promise<void> {
		// get light object
		let light = this.storage.lights?.[id] as Models.Light;
		if (light) {
			if (!light.state) { light.state = {} }
			// set states
			light.state.on = state.on;
			light.state.bri = state.bri;
			light.state.hue = state.hue;
			light.state.sat = state.sat;
			light.state.xy = state.xy;
			light.state.ct = state.ct;
			// write to file
			return this.writeStorage(this.storage)
				.catch(error => {
					return Promise.reject(new HueStorageErrors.WriteStorage(error));
				});	
		} else {
			return Promise.reject(new HueStorageErrors.LightNotFound('Light id '+id+ ' has not been found'));
		}
	}

	/**
	 * Delete light element
	 * @param id Id of the light
	 * @returns Promise to confirm the update being written to file 
	 */
	public async deleteLight(id: string): Promise<void> {
		// get light object
		if (!this.storage.lights) { this.storage.lights = {}; }
		// delete element
		delete this.storage.lights[id];
		// write to file
		return this.writeStorage(this.storage)
			.catch(error => {
				return Promise.reject(new HueStorageErrors.WriteStorage(error));
			});	
	}

	/**
	 * Generate a new light randomly from the template file
	 * @returns Promise of new light
	 */
	public async newRandomLight(): Promise<Models.Light> {
		// get template file
		let templates = await this.getFilecontent<[Models.Light]>(this.templateFile);
		// select a random element
		let light = templates[Math.floor(Math.random() * templates.length)];
		// Randomize unique parameters
		light.uniqueid = this.getRandomUniqueid();
		return light;
	}

	/** Generate unique identifier in the format of "00:17:88:01:02:f0:5b:bc-0b" */
	private getRandomUniqueid(): string {
		let uniques: string[] = [];
		for (let i = 0; i < 8; i++) {
			uniques.push(Randomizers.randomString(2, '0123456789abcdef'));
		}
		let uniqueid = uniques.join(':') + '-' + Randomizers.randomString(2, '0123456789abcdef');
		return uniqueid;
	}
}