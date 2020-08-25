import { MongoClient, Db } from "mongodb";

export default class MongoConnector {
	connected: boolean;
	host: string;
	port: number;
	error: any;
	private __client: MongoClient;
	private __dbName: string;
	private __db: Db;

	constructor(config) {
		this.host = config.host;
		this.port = config.port ?? 27017;
		this.__dbName = config.dbName;
	}

	async connect(): Promise<MongoClient | void> {
		return await MongoClient.connect(`mongodb://${this.host}:${this.port}`, { useUnifiedTopology: true, })
			.then(client => {
				this.connected = true;	
				this.__client = client;
				this.__db = this.__client.db(this.__dbName);
				return client;
			})
			.catch(err => {
				this.connected = false;
				this.error = err;
				throw err;
			})
	}

	getDb(): Db {
		return this.__db;
	}
}