import { Request, Response } from 'express'
import suncalc from 'suncalc';
import { Light } from './light';
import vendorControllers from "./vendor-controllers"
import { VendorController } from './vendor-controllers/VendorController';
import LightsModel from "../connector/lights.model";
import { Db } from "mongodb";
import { Redis } from "ioredis"
import { LightResponse } from './vendor-controllers/LightResponse';
import ServiceConnector from '../connector/serviceConnector';

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
	private __lightsModel: LightsModel;

	constructor(
		connector: ServiceConnector
	) {
		this.__lightsModel = connector.lightsModel;
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
				this.__lightsModel.updateLightState(body.target, data.state);
				break;
			}
		}
	}

	private get __allVendors(): [string, VendorController][] {
		return Object.entries(this.vendorControllers);
	}

	async getAllLights(): Promise<Light[]> {
		return await this.__lightsModel.getAllLights();
	}

	async discover(): Promise<Light[]> {
		let vendorLightMap: {[key: string]: Promise<Light[]>} = {};

		for (let [vendor, vendorController] of this.__allVendors) {
			vendorController.discover().then(lights => {
				this.__lightsModel.addLights(lights, vendor);
			});
		}
		return await this.__lightsModel.getAllLights();
	}

	async command(targetId, method, parameters): Promise<LightResponse> {
		let light = await this.__lightsModel.getLight(targetId);
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
