import ServiceConnector from "./serviceConnector";
import MongoConnector from "./mongo/mongo.connector";
import RedisConnector from "./redis/redis.connector";
import LightsModel from "./lights.model";

export default class Connector {
	service: string;
	connected: boolean;
	host: string;
	port: number;
	private __dbName: string;
	private __serviceConnector: ServiceConnector

	constructor(config) {
		this.service = config.service;
		this.host = config.host ?? "localhost";
		this.port = config.port;
		this.__dbName = config.dbName;

		switch(this.service) {
			case "mongo": {
				this.__serviceConnector = new MongoConnector({
					host: this.host,
					port: this.port,
					dbName: "sumalux",
				})
				break;
			}
			case "redis": {
				this.__serviceConnector = new RedisConnector({
					host: this.host,
					port: this.port,
				})
				break;
			}
		}
	}

	async connect(): Promise<any | void> {
		return await this.__serviceConnector.connect()
	}

	get lightsModel(): LightsModel {
		return this.__serviceConnector.lightsModel;
	}
}