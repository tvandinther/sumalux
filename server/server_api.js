var exports = module.exports = {};
const { Yeelight } = require('yeelight-node-binding');
const { Client } = require('yeelight-node-binding');
const suncalc = require('suncalc');
const { resolve } = require('path');

const client = new Client();
client.bind()

now = function() {
    return new Date();
}

deltaDate = function(dayDelta) {
    return new Date((new Date() / 1) + (60 * 60 * 24 * dayDelta * 1000))
}

const LIGHT_PROPS = [
	'power',
	'bright',
	'color_mode',
	'ct',
	'rgb',
	'hue',
	'sat'
]

exports.scan = function() {
    return new Promise((resolve, reject) => {

        client.search();

        function returnFunc() {
            resolve(client.lights);
        }
        setTimeout(returnFunc, 500);
    })
}

exports.command = async function(target_ip, method, parameters) {
	let light = client.lights.find(lights => lights.ip == target_ip)

	switch(method) {
		case "toggle": {
			return light.toggle();
		}
		case "set_power": {
			return light.set_power(parameters.power);
		}
		case "set_brightness": {
			return light.set_bright(parameters.brightness);
		}
		case "set_rgb": {
			return light.set_rgb(parameters.rgb);
		}
		default: {
			return Promise.reject("Invalid method");
		}
	}
}

exports.getSuncalc = function(date, days, lat, long) {
    result = {};
    for (let i = 0; i < days; i++) {
        result[deltaDate(i).toDateString()] = suncalc.getTimes(deltaDate(i), lat, long);
    }
    return result;
}

exports.scan()