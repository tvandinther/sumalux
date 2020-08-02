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

	req(req: Request, res: Response): void {
		console.log("YES")
		console.log(req.path)

		switch (req.path) {
			case '/api/light/scan': {
				this.discover();
			}
			default: {
				// return code 400
			}
		}
	}

	private get __allVendors(): [string, VendorController][] {
		return Object.entries(this.vendorControllers);
	}

	discover(): void {
		let vendorLightMap: {[key: string]: Promise<Light[]>} = {};

		for (let [vendor, vendorController] of this.__allVendors) {
			vendorController.discover().then(lights => {
				this.lightsDb.addLights(lights)
			});
		}

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
