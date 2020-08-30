conn = new Mongo()
db = conn.getDB('simulux')

/*
	lights: Contains all light information.
*/
db.createCollection('lights', {
	autoIndexId: false, // ID becomes the IP address of the light as this must be unique
})
lights = db.getCollection('lights')
lights.createIndex({ ip: 1 }, { unique: true })

/*
	users: Contains information of all system users.
*/
users = db.createCollection('users', {
	autoIndexId: true,
})

/*
	lightGroups: Contains information on groups of lights. All lights are also represented as a group consisting of only itself.
*/
lightGroups = db.createCollection('lightGroups', {
	autoIndexId: true,
})

/*
	lightGroupUsers: Associative collection of one user's permissions on one group of lights.
*/
lightGroupUsers = db.createCollection('lightGroupUsers', {
	autoIndexId: true,
})

/*
	cron: A collection of cron jobs.
*/
cron = db.createCollection('cron', {
	autoIndexId: true,
})

/*
	log: A collection of system logs.
*/
log = db.createCollection('log', {
	autoIndexId: true,
})
