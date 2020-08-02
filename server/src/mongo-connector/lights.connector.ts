import { Db, Collection } from "mongodb";
import { Light } from "../lights/light";
import { LightGroup } from "../lights/lightGroup";

export default class LightsConnector {

	database: Db;
	lights: Collection;
	lightGroups: Collection;
	lightGroupUsers: Collection;

	constructor(database: Db) {
		this.database = database;
		this.lights = this.database.collection('lights');
		this.lightGroups = this.database.collection('lightGroups');
		this.lightGroupUsers = this.database.collection('lightGroupUsers');
	}

	addLights(lights: Light[]) {
		lights.forEach(light => {
			delete light['client'];
			this.lights.updateOne({_id: light.ip}, {
				$set: {
					_id: light.ip,
					...light
				}
			}, { upsert: true })

			// ADD LIGHT GROUPS
			// TO DO
			this.lightGroups.updateOne({lights: [light.ip]}, {
				$set: {
					soloGroup: true,
					lights: [light.ip]
				}
			}, { upsert: true })
		})

		
	}

	async getAllLights(): Promise<Light[]> {
		let lightIps = await this.lightGroups.find<LightGroup>({soloGroup: true}).map(lightGroup => lightGroup.lights.pop()).toArray();
		return await this.lights.find<Light>({_id: {$in: lightIps}}).toArray();
	}
}