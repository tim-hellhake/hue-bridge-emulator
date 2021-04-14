/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { networkInterfaces } from 'os';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import hueColorLamp from './hue-color-lamp.json';
import { createSocket } from 'dgram';
import { AddressInfo } from 'net';
import { createUser } from './express-controller/hue-bridge-config';
import { authUser } from './express-middleware/hue-bridge-auth';
import { searchNewLights, getLights, getNewLights, getLight, setLight, setLightState, deleteLight } from './express-controller/hue-bridge-lights';
import { deleteGroup, getGroup, getGroups, newGroup, setGroup, setGroupAction } from './express-controller/hue-bridge-groups';
import { deleteScene, getScene, getScenes, newScene, setScene } from './express-controller/hue-bridge-scenes';

interface ConfigOptions {
    port?: number,
    debug?: boolean
}

interface Config {
    port: number,
    debug: boolean
}

const defaultConfig: Config = {
    port: 80,
    debug: false
}

export class HueBridge {
    private lights: { [key: string]: any } = {};
    private callbacks: { [key: string]: (key: string, value: any) => void } = {};
    private nextId: number = 0;
    private config: Config;

    constructor(config: ConfigOptions = {}) {
        this.config = { ...defaultConfig, ...config }
    }

    private debug(args: any) {
        if (this.config) {
            console.log(args);
        }
    }

    start() {
        const descriptionPath = '/description.xml';
        const prefix = '001788';
        const postfix = '7ebe7d';
        const serialNumber = `${prefix}${postfix}`;
        const bridgeId = `${prefix}FFFE${postfix}`;
        const uuid = `2f402f80-da50-11e1-9b23-${serialNumber}`;
        const ipAddress = this.getIpAddress();

        const app = express();
        app.use(json());
        app.use(urlencoded({ extended: true }));

        app.use((req, _, next) => {
            this.debug(`${req.ip} ${req.method} ${req.originalUrl}`);
            next();
        });

        // Get description.xml for UPnP compatibility
        app.get(descriptionPath, (_, res) => {
            res.status(200).send(this.createDescription(ipAddress, this.config.port, serialNumber, uuid));
        });


        /**
         * Create new user
         * @see https://developers.meethue.com/develop/hue-api/7-configuration-api/#create-user
         */
        app.post('/api', createUser);


        /**
         * Initiate search for new lights (simulation only)
         * @see https://developers.meethue.com/develop/hue-api/lights-api/#search-for-new-lights
         */
        app.post('/api/:user/lights', authUser, searchNewLights);

        /** 
         * Receive list of new lights 
         * @see https://developers.meethue.com/develop/hue-api/lights-api/#get-new-lights
         * */ 
        app.get('/api/:user/lights/new', authUser, getNewLights);

        /**
         * Receive list of lights
         * @see https://developers.meethue.com/develop/hue-api/lights-api/#get-all-lights
         */
        app.get('/api/:user/lights', authUser, getLights);

        /**
         * Receive a light from the light list
         * @see https://developers.meethue.com/develop/hue-api/lights-api/#get-attr-and-state
         */
        app.get('/api/:user/lights/:lightid', authUser, getLight);

        /**
         * Set attributes of a light (e.g. name)
         * @see https://developers.meethue.com/develop/hue-api/lights-api/#set-light-attr-rename
         */
        app.put('/api/:user/lights/:lightid', authUser, setLight);

        /** 
         * Set state of a light
         * @see https://developers.meethue.com/develop/hue-api/lights-api/#set-light-state
         */
        app.put('/api/:user/lights/:lightid/state', authUser, setLightState);

        /**
         * Delete a light
         * @see https://developers.meethue.com/develop/hue-api/lights-api/#del-lights
         */
        app.delete('/api/:user/lights/:lightid', authUser, deleteLight);


        /**
         * Create a group
         * @see https://developers.meethue.com/develop/hue-api/groupds-api/#create-group
         */
        app.post('/api/:user/groups', authUser, newGroup);

        /**
         * Receive list of groups
         * @see https://developers.meethue.com/develop/hue-api/groupds-api/#get-all-groups
         */
        app.get('/api/:user/groups', authUser, getGroups);

        /**
         * Receive a group from the group list
         * @see https://developers.meethue.com/develop/hue-api/groupds-api/#get-group-attr
         */
        app.get('/api/:user/groups/:groupid', authUser, getGroup);

        /**
         * Set attributes of a group (e.g. name, lights, or class)
         * @see https://developers.meethue.com/develop/hue-api/groupds-api/#set-group-attr
         */
        app.put('/api/:user/groups/:groupid', authUser, setGroup);

        /** 
         * Set action of a group
         * @see https://developers.meethue.com/develop/hue-api/groupds-api/#set-gr-state
         */
        app.put('/api/:user/groups/:groupid/action', authUser, setGroupAction);

        /**
         * Delete a group
         * @see https://developers.meethue.com/develop/hue-api/groupds-api/#del-group
         */
        app.delete('/api/:user/groups/:groupid', authUser, deleteGroup);


        /**
         * Create a scene
         * @see https://developers.meethue.com/develop/hue-api/4-scenes/#create-scene
         */
        app.post('/api/:user/scenes', authUser, newScene);

        /**
         * Receive list of scenes
         * @see https://developers.meethue.com/develop/hue-api/4-scenes/#get-all-scenes
         */
        app.get('/api/:user/scenes', authUser, getScenes);

        /**
         * Receive scene from the scenes list
         * @see https://developers.meethue.com/develop/hue-api/4-scenes/#get-scene
         */
        app.get('/api/:user/scenes/:sceneid', authUser, getScene);

        /**
         * Set attributes of a scene (e.g. name, lights, or lightstates)
         * @see https://developers.meethue.com/develop/hue-api/4-scenes/#43_modify_scene
         */
        app.put('/api/:user/groups/:sceneid', authUser, setScene);

        /**
         * Delete a scene
         * @see https://developers.meethue.com/develop/hue-api/4-scenes/#delete-scene
         */
        app.delete('/api/:user/scenes/:sceneid', authUser, deleteScene);
        
        
        const restServer = app.listen(this.config.port, () => {
            const info: AddressInfo | null = <AddressInfo>restServer?.address();
            console.log(`Api is listening on ${info?.address}:${info?.port}`);
        });

        const socket = createSocket({ type: 'udp4', reuseAddr: true });

        socket.on('message', (msg: string, rinfo) => {
            if (msg.indexOf('M-SEARCH') >= 0) {
                this.debug(`Received M-SEARCH from ${rinfo.address}:${rinfo.port}`);
                const uin = `uuid:${uuid}`;

                socket.send(this.createResponse(ipAddress, this.config.port, descriptionPath, bridgeId,
                    'upnp:rootdevice', `${uin}::upnp:rootdevice`
                ), rinfo.port, rinfo.address, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
                socket.send(this.createResponse(ipAddress, this.config.port, descriptionPath, bridgeId,
                    uin, uin
                ), rinfo.port, rinfo.address, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
                socket.send(this.createResponse(ipAddress, this.config.port, descriptionPath, bridgeId,
                    'urn:schemas-upnp-org:device:basic:1', uin
                ), rinfo.port, rinfo.address, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        });

        socket.on('listening', () => {
            const address = socket.address();
            console.log(`Discovery is listening on ${address.address}:${address.port}`);
        });

        socket.bind(1900, () => {
            socket.addMembership('239.255.255.250');
        });
    }

    private getIpAddress() {
        const interfaces = networkInterfaces();

        for (const name in interfaces) {
            const networkInterface = interfaces[name];

            if (networkInterface) {
                for (const subInterface of networkInterface) {

                    if (subInterface.family == 'IPv4' && subInterface.internal == false) {
                        this.debug(`Found ip address ${subInterface.address}`);
                        return subInterface.address;
                    }
                }
            }
        }

        throw 'No ip address found';
    }

    addLight(name: string, onChange?: (key: string, value: any) => void) {
        const light = JSON.parse(JSON.stringify(hueColorLamp));
        light.name = name;
        const id = this.nextId;
        this.nextId++;
        this.lights[id] = light;

        if (onChange) {
            this.callbacks[id] = onChange;
        }
    }

    createDescription(ip: string, port: number, serialNumber: string, uuid: string) {
        return `<?xml version='1.0' encoding='UTF-8' ?>
<root xmlns='urn:schemas-upnp-org:device-1-0'>
<specVersion>
<major>1</major>
<minor>0</minor>
</specVersion>
<URLBase>http://${ip}:${port}/</URLBase>
<device>
<deviceType>urn:schemas-upnp-org:device:Basic:1</deviceType>
<friendlyName>Philips hue (${ip})</friendlyName>
<manufacturer>Royal Philips Electronics</manufacturer>
<manufacturerURL>http://www.philips.com</manufacturerURL>
<modelDescription>Philips hue Personal Wireless Lighting</modelDescription>
<modelName>Philips hue bridge 2015</modelName>
<modelNumber>BSB002</modelNumber>
<modelURL>http://www.meethue.com</modelURL>
<serialNumber>${serialNumber}</serialNumber>
<UDN>uuid:${uuid}</UDN>
<presentationURL>index.html</presentationURL>
<iconList>
<icon>
<mimetype>image/png</mimetype>
<height>48</height>
<width>48</width>
<depth>24</depth>
<url>hue_logo_0.png</url>
</icon>
</iconList>
</device>
</root>
    `.replace(new RegExp('\n', 'g'), '\r\n');
    }

    createResponse(ip: string, port: number, path: string, bridgeid: string, st: string, usn: string) {
        return `HTTP/1.1 200 OK
HOST: 239.255.255.250:1900
EXT:
CACHE-CONTROL: max-age=100
LOCATION: http://${ip}:${port}${path}
SERVER: Linux/3.14.0 UPnP/1.0 IpBridge/1.29.0
hue-bridgeid: ${bridgeid}
ST: ${st}
USN: ${usn}
    
    `.replace(new RegExp('\n', 'g'), '\r\n');
    }
}
