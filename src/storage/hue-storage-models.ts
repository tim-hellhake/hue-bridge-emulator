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
    /** Registered groups */
    groups?: { [key: string]: Group };
    /** Registered scenes */
    scenes?: { [key: string]: Scene };
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


export interface Group {
    name?: string;
    lights?: string[];
    sensors?: any[];
    type?: string;
    state?: GroupState;
    recycle?: boolean;
    class?: string;
    action?: GroupAction;
}

export interface GroupState {
    all_on?: boolean;
    any_on?: boolean;
}

export interface GroupAction {
    on?: boolean;
    bri?: number;
    hue?: number;
    sat?: number;
    effect?: string;
    xy?: number[];
    ct?: number;
    alert?: string;
    colormode?: string;
}


export interface Scene {
    name?: string;
    type?: string;
    group?: string;
    lights?: string[];
    owner?: string;
    recycle?: boolean;
    locked?: boolean;
    appdata?: SceneAppdata;
    picture?: string;
    image?: string;
    lastupdated?: Date;
    version?: number;
    lightstates?: { [key: string]: LightState };
}

export interface SceneAppdata {
    version?: number;
    data?: string;
}