const Redis = require("ioredis")

const redis = new Redis({
	port: 6379, // Redis port
	host: "sumalux-redis", // Redis host
	family: 4, // 4 (IPv4) or 6 (IPv6)
	password: "",
	db: 0,
	lazyConnect: true,
});


async function test() {
	let connection = await redis.connect()
	console.log(redis)
	// await redis.set("foo", "bar")
	// let result = await redis.get("foo")
	// console.log(result)
}

test()