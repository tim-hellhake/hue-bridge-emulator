/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Interface for Hue storage file */
export interface File {
	/** Users being whitelisted */
	whitelist?: Array<string>;
	/** Registered lights */
	lights?: { [key: string]: Light };
}

export interface Light {
    state: LightState;
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    uniqueid: string;
    productid?: string;
}

export interface LightState {
    on?: boolean;
    bri?: number;
    ct?: number;
    alert?: string;
    colormode?: string;
    mode?: string;
    reachable?: boolean;
    hue?: number;
    sat?: number;
    effect?: string;
    xy?: number[];
}