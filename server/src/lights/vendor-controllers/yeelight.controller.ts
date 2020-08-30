import { Client, Yeelight as YeelightBind } from 'yeelight-node-binding';
import { VendorController } from './VendorController';
import { LightResponse } from './LightResponse';
import { Yeelight } from '../yeelight.light';

function yeelightCommand(argMap: {[key: string]: number}) {
	return function (target: YeelightController, propertyKey: string, descriptor: PropertyDescriptor) {
		let originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]): Promise<LightResponse> {
			let light: Yeelight = args[0] // arg[0] contains the light
			args[0] = target.__getBinding.call(this, light);
			
			// This function converts argument indices into values and maps them to the state object
			const mapArgState = (map: {[key: string]: number}) => {
				let result = {};
				for (let [prop, argIndex] of Object.entries(map)) {
					result[prop] = args[argIndex];
				}
				return result;
			}

			try {
				let response = JSON.parse(await originalMethod.apply(this, args));
				if (response.result) {
					return {
						success: true,
						state: {
							...light.state,
							...mapArgState(argMap),
						}
					}
				}
				// If response does not include "result", an error was returned as per Yeelight API Documentation
				else throw(Error)
			} catch (error) {
				return {
					success: false,
					state: light.state,
				}
			}
		}
	}
}

export default class YeelightController implements VendorController {

	client: Client;
	lights: Map<String, YeelightBind>;
	private discoveryTimeout: number;

	constructor() {
		this.client = new Client();
		this.lights = new Map();
		this.client.bind();
		this.discoveryTimeout = 500;
	}

	__getBinding(light: Yeelight): YeelightBind {
		return this.lights.get(light.ip) || new YeelightBind({ ...light })
	}

	discover(): Promise<any[]> {
		return new Promise<any[]>((resolve, reject): void => {
			this.client.search();

			setTimeout((): void => {
				// this.lights = new Map(this.client.lights.map<YeelightBind>(light => [light.ip, light]));
				if (this.client.lights.array?.length > 0) {
					this.client.lights.array.forEach(light => this.lights.set(light.ip, light));
				}
				resolve(this.client.lights);
			}, this.discoveryTimeout); // allow time for lights to respond
		})
	}

	toggle(light: Yeelight): any {
		let selectedLight: YeelightBind = this.client.lights.find(lightClient => lightClient.ip == light.ip)
		selectedLight.toggle();
	}

	@yeelightCommand({
		on: 1,
	})
	setPower(light: YeelightBind, power: Boolean): LightResponse {
		return light.set_power(power ? "on" : "off");
	}

	@yeelightCommand({
		brightness: 1,
	})
	setBrightness(light: YeelightBind, brightness: number): any {
		return light.set_bright(brightness);
	}

	setRGB(light: YeelightBind): any {

	}
}