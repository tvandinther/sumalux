import { Client } from 'yeelight-node-binding';
import { VendorController } from './VendorController';
import { Yeelight } from '../yeelight.light';

export default class YeelightController implements VendorController {

	client: Client;
	lights: Yeelight[];
	discoveryTimeout: number;

	constructor() {
		this.client = new Client();
		this.client.bind();
		this.discoveryTimeout = 500;
	}

	discover(): Promise<Yeelight[]> {
		return new Promise<Yeelight[]>((resolve, reject): void => {
			this.client.search();

			setTimeout((): void => {
				this.lights = this.client.lights;
				resolve(this.lights);
			}, this.discoveryTimeout); // allow 500ms for lights to respond
		})
	}
}