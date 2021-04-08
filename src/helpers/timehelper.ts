/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function getIsoDateTime(): string {
	var dateFormat = require('dateformat');
	var now = new Date();
	return dateFormat(now, "yyyy-mm-dd'T'hh:MM:ss");
}