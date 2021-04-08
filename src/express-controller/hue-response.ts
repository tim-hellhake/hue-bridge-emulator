/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

interface HueResponse {
	error?: HueError;
	success?: HueSuccess | string;
}

interface HueError {
	type: number;
	address: string;
	description: string;
}

interface HueSuccess {
	[key: string]: string;
}

export enum Type {
	UnauthorizedUser = 1,
	MissingParameter = 5,
	InternalError = 901
}

export enum Description {
	UnauthorizedUser = 'unauthorized user',
	MissingParameter = 'invalid/missing parameters in body',
	InternalError = 'Internal error occurred'
}

/**
 * Message structure to response an Error in the following format: `{
        "error": {
            "type": <TYPE> ,
            "address": <ADDRESS>,
            "description": <DESCRIPTION>
        }
    }`
 * @param type Error type
 * @param address Address of the operation
 * @param description Error description
 * @returns List containing one item per parameter failed
 */
export const error = (type: Type, address: string, description: Description): Array<HueResponse> => {
	return [{
		error: { 
			type: type, 
			address: address, 
			description: description
		} as HueError
	}]
}

/**
 * Message structure to response a Success in the following format: `[{"success":{<ADDRESS>: <MESSAGE>}}]`
 * @param address Indicating the address of the operation
 * @param message Success message
 * @returns List containing one item per parameter modified
 */
export const successStructure = (address: string, message: string): Array<HueResponse> => {
	let map: {[key: string]: string} = {};
	map[address] = message;
	return [{
		success: map
	}];
}

/**
 * Message structure to response a Success in the following format: `[{"success": <MESSAGE>}]`
 * @param message Success message
 * @returns List containing one item per parameter modified
 */
export const success = (message: string): Array<HueResponse> => {
	return [{
		success: message
	}];
}