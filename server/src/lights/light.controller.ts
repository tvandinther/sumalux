import { Request, Response } from 'express'
import suncalc from 'suncalc';
import { Light } from './light';
import vendorControllers from "./vendor-controllers"
import { VendorController } from './vendor-controllers/VendorController';
import { MongoConnector, LightsConnector } from "../mongo-connector";
import { Db } from "mongodb";

const LIGHT_PROPS = [
	'power',
	'bright',
	'color_mode',
	'ct',
	'rgb',
	'hue',
	'sat'
]

interface VendorControllers {
	[key: string]: VendorController;
}

export default class LightController {
	
	vendorControllers: VendorControllers;
	lightsDb: LightsConnector;

	constructor(
		database: Db
	) {
		this.lightsDb = new LightsConnector(database);
		this.vendorControllers = {};
		for (let [name, vendorController] of Object.entries(vendorControllers)) {
			this.vendorControllers[name] = new vendorController();
		}
	}

	get(req: Request, res: Response): void {
		console.log("LIGHT REQUEST:", req.params)

		switch (req.params[0]) {
			case 'get_all': {
				this.getAllLights().then(data => res.send(data));
				break;
			}
			case 'scan': {
				this.discover().then(data => res.send(data));
				break;
			}
			default: {
				res.status(400).send();
				break;
			}
		}
	}

	post(req: Request, res: Response): void {
		const data = req.body;
		switch (req.params[0]) {
			case 'command': {
				this.command(data.target, data.method, data.parameters);
			}
		}
	}

	private get __allVendors(): [string, VendorController][] {
		return Object.entries(this.vendorControllers);
	}

	async getAllLights(): Promise<Light[]> {
		return await this.lightsDb.getAllLights();
	}

	async discover(): Promise<Light[]> {
		let vendorLightMap: {[key: string]: Promise<Light[]>} = {};

		for (let [vendor, vendorController] of this.__allVendors) {
			vendorController.discover().then(lights => {
				this.lightsDb.addLights(lights);
			});
		}
		return await this.lightsDb.getAllLights();
	}

	command(target_ip, method, parameters): Promise<any> {
		let light;

		switch(method) {
			case "toggle": {
				return light.toggle();
			}
			case "set_power": {
				return light.set_power(parameters.power);
			}
			case "set_brightness": {
				return light.set_bright(parameters.brightness);
			}
			case "set_rgb": {
				return light.set_rgb(parameters.rgb);
			}
			default: {
				return Promise.reject("Invalid method");
			}
		}
	}
}
