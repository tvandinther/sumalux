import { Request, Response } from 'express'
import suncalc from 'suncalc';
import { Light } from './light';
import vendorControllers from "./vendor-controllers"
import { VendorController } from './vendor-controllers/VendorController';
import { LightsModel } from "../mongo-connector";
import { Db } from "mongodb";
import { LightResponse } from './vendor-controllers/LightResponse';

const LIGHT_PROPS = [
	'power',
	'bright',
	'color_mode',
	'ct',
	'rgb',
	'hue',
	'sat'
]

export default class LightController {
	
	vendorControllers: { [key: string]: VendorController };
	lightsDb: LightsModel;

	constructor(
		database: Db
	) {
		this.lightsDb = new LightsModel(database);
		this.vendorControllers = {};
		for (let [name, vendorController] of Object.entries(vendorControllers)) {
			this.vendorControllers[name] = new vendorController();
		}
	}

	async get(req: Request, res: Response): Promise<void> {
		console.log("LIGHT REQUEST:", req.params)

		switch (req.params[0]) {
			case 'get_all': {
				let data = await this.getAllLights();
				res.send(data)
				break;
			}
			case 'scan': {
				let data = await this.discover();
				res.send(data);
				break;
			}
			default: {
				res.status(400).send();
				break;
			}
		}
	}

	async post(req: Request, res: Response): Promise<void> {
		const body = req.body;
		//console.log("LIGHT REQUEST:", req.params, data)
		switch (req.params[0]) {
			case 'command': {
				let data = await this.command(body.target, body.method, body.parameters);
				res.send(data);
				this.lightsDb.updateLightState(body.target, data.state);
				break;
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
				this.lightsDb.addLights(lights, vendor);
			});
		}
		return await this.lightsDb.getAllLights();
	}

	async command(targetId, method, parameters): Promise<LightResponse> {
		let light = await this.lightsDb.getLight(targetId);
		let vendorController = this.vendorControllers[light.vendor]

		switch(method) {
			case "toggle": {
				return vendorController.toggle(light);
			}
			case "set_power": {
				return await vendorController.setPower(light, parameters.power);
			}
			case "set_brightness": {
				return vendorController.setBrightness(light, parameters.brightness);
			}
			case "set_rgb": {
				return vendorController.setRGB(light, parameters.rgb);
			}
			default: {
				return Promise.reject("Invalid method");
			}
		}
	}
}
