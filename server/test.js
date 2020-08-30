const Redis = require("ioredis")

const { Yeelight } = require('yeelight-node-binding');
const { Client } = require('yeelight-node-binding');

const redis = new Redis({
	port: 6379, // Redis port
	host: "simulux-redis", // Redis host
	family: 4, // 4 (IPv4) or 6 (IPv6)
	password: "",
	db: 0,
	lazyConnect: true,
});

const client = new Client();
client.bind();

function scan() {
	return new Promise((resolve, reject) => {
			var lights = {};

			client.search();
			console.log("Searching for lights...")
			function returnFunc() {
					resolve(client.lights);
			}
			setTimeout(returnFunc, 1000);
	})
}

async function test() {
	let connection = await redis.connect()
	console.log(redis)
	// await redis.set("foo", "bar")
	// let result = await redis.get("foo")
	// console.log(result)
}

scan().then(result => console.log(result))