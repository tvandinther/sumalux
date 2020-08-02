import { Db, Collection } from "mongodb";
import { Light } from "../lights/light";

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
		let lightDocuments = lights.map(light => ({
			_id: light.host,
			...light,
		}))
		console.log("adding lights");
		this.lights.insertMany(lightDocuments, {
			ordered: false,
		})

		// ADD LIGHT GROUPS
		// TO DO
	}
}