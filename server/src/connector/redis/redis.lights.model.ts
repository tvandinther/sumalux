import LightsModel from "../lights.model";
import { Redis } from "ioredis";
import { Light, LightState } from "../../lights/light";
import { LightGroup } from "../../lights/lightGroup";
import { Yeelight } from "yeelight-node-binding";

export default class RedisLightsModel implements LightsModel {
	redis: Redis;

	constructor(redis: Redis) {
		this.redis = redis;
	}

	addLights(lights: Yeelight[], vendor) {
		const pipeline = this.redis.pipeline();
		lights.forEach(light => {
			light = {
				...light,
				vendor: vendor,
			}
			delete light['client'];
			const lightState = light.state
			delete light.state
			// Add individual lights
			pipeline.set(`light:${light.ip}`, JSON.stringify(light));
			// Add light state seperately
			pipeline.set(`light:${light.ip}.state`, JSON.stringify(lightState));
			// Add all lights to set
			pipeline.sadd("light:all", light.ip);
		})
		pipeline.exec()
		.then(resp => console.log(resp))
		.catch(err => console.log(err))

	}

	async getLight(lightId: string): Promise<Light> {
		let response = await this.redis.get(`light:${lightId}`)
		return JSON.parse(response);
	}

	async getAllLights(): Promise<any[]> {
		const lightIps = await this.redis.smembers("light:all")
		const pipeline = this.redis.pipeline();
		lightIps.forEach(lightIp => {
			pipeline.get(`light:${lightIp}`);
			pipeline.get(`light:${lightIp}.state`);
		})
		const response = await pipeline.exec();
		let parsedResponse = []
		for (let i = 0; i < response.length; i += 2) {
			parsedResponse.push({
				...JSON.parse(response[i][1]), // parse light data
				state: JSON.parse(response[i + 1][1]) // parse lightState data
			});
		}
		return parsedResponse;
	}

	async updateLightState(lightId: string, newState: LightState): Promise<any> {
		this.redis.set(`light:${lightId}.state`, JSON.stringify(newState));
	}
}