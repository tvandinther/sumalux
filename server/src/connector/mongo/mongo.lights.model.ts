import { Db, Collection } from "mongodb";
import { Light, LightState } from "../../lights/light";
import { LightGroup } from "../../lights/lightGroup";
import LightsModel from "../lights.model";

export default class MongoLightsModel implements LightsModel {

	__database: Db;
	__lights: Collection;
	__lightGroups: Collection;
	__lightGroupUsers: Collection;

	constructor(database: Db) {
		this.__database = database;
		this.__lights = this.__database.collection('lights');
		this.__lightGroups = this.__database.collection('lightGroups');
		this.__lightGroupUsers = this.__database.collection('lightGroupUsers');
	}

	addLights(lights: Light[], vendor) {
		lights.forEach(light => {
			delete light['client'];
			this.__lights.updateOne({_id: light.ip}, {
				$set: {
					_id: light.ip,
					vendor: vendor,
					...light,
				}
			}, { upsert: true })

			// ADD LIGHT GROUPS
			// TO DO
			this.__lightGroups.updateOne({lights: [light.ip]}, {
				$set: {
					soloGroup: true,
					lights: [light.ip]
				}
			}, { upsert: true });
		})
	}

	async getLight(lightId: string): Promise<Light> {
		return await this.__lights.findOne<Light>({_id: lightId});
	}

	async getAllLights(): Promise<Light[]> {
		let lightIps = await this.__lightGroups.find<LightGroup>({soloGroup: true}).map(lightGroup => lightGroup.lights.pop()).toArray();
		return await this.__lights.find<Light>({_id: {$in: lightIps}}).toArray();
	}

	async updateLightState(lightId: string, newState: LightState): Promise<any> {
		return await this.__lights.updateOne({_id: lightId}, {
			$set: {
				state: newState
			}
		}, { upsert: true });
	}
}