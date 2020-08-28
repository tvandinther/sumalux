import LightsModel from "../lights.model";
import { Redis } from "ioredis";
import { Light, LightState } from "../../lights/light";
import { LightGroup } from "../../lights/lightGroup";

export default class RedisLightsModel implements LightsModel {
	redis: Redis;

	constructor(redis: Redis) {
		this.redis = redis;
	}

	addLights(lights: Light[], vendor) {

	}

	async getLight(lightId: string): Promise<Light> {
		let response = await this.redis.get("light:" + lightId)
		return JSON.parse(response);
	}

	async getAllLights(): Promise<Light[]> {
		let response = await this.redis.get("light:")
		return JSON.parse(response);
	}

	async updateLightState(lightId: string, newState: LightState): Promise<any> {
		
	}
}