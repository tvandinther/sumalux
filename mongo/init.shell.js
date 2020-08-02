conn = new Mongo()
db = conn.getDB('sumalux')

lights = db.createCollection('lights', {
	autoIndexId: true,
})

lightGroups = db.createCollection('lightGroups', {
	autoIndexId: true,
})

cron = db.createCollection('cron', {
	autoIndexId: true,
})

log = db.createCollection('log', {
	autoIndexId: true,
})

users = db.createCollection('users', {
	autoIndexId: true,
})

