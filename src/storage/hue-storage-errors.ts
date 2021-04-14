/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export module HueStorageErrors {
	export class WriteStorage extends Error {
		constructor(message: string) {
			super(message);
			this.name = "WriteStorageError";
		}
	}

	export class LightNotFound extends Error {
		constructor(message: string) {
			super(message);
			this.name = "LightNotFoundError";
		}
	}

	export class GroupNotFound extends Error {
		constructor(message: string) {
			super(message);
			this.name = "GroupNotFound";
		}
	}
}
