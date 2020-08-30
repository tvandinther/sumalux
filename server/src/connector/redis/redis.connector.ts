import Redis, { Redis as RedisInterface } from "ioredis"
import ServiceConnector from "../serviceConnector";
import LightsModel from "../lights.model";
import LightsRedisModel from "./redis.lights.model";
import RedisLightsModel from "./redis.lights.model";

export default class RedisConnector implements ServiceConnector {
	connected: boolean;
	host: string;
	port: number;
	lightsModel: LightsModel;
	private __client: RedisInterface;
	// private __dbName: string;
	// private __db: Db;

	constructor(config) {
		this.host = config.host;
		this.port = config.port ?? 27017;
	}

	async connect(): Promise<RedisInterface | void> {
		const redis = new Redis({
			port: this.port ?? 6379,
			host: this.host,
			family: 4,
			password: "",
			db: 0,
			lazyConnect: true,
		})
		return await redis.connect().then(() => {
				this.connected = true;	
				this.__client = redis;
				this.lightsModel = new RedisLightsModel(redis);
				return redis;
			})
			.catch(err => {
				this.connected = false;
				return err;
			})
	}
}