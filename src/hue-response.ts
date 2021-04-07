/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface HueResponse {
	error?: HueError;
	success?: HueSuccessUsername;
}

export interface HueError {
	type: number;
	address: string;
	description: string;
}

export interface HueSuccessUsername {
	username: string;
}

export class HueResponseDefaults {
	static errorUnauthorized(address: string = '/'): Array<HueResponse> {
		return [{
			error: { 
				type: 1, 
				address: address, 
				description: 'unauthorized user'
			}
		}]
	}

	static errorMissingParameters(address: string = '/'): Array<HueResponse> {
		return [{
			error: { 
				type: 5, 
				address: address, 
				description: 'invalid/missing parameters in body'
			}
		}]
	}

	static successUsername(username: string): Array<HueResponse> {
		return [{
			success: {
				username: username
			}
		}]
	}
}