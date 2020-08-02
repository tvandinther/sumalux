export interface Yeelight {
	id: string,
	ip: string,
	port: string,
	name: string,
	model: string,
	methods: string[],
	state: {
		on: boolean,
		brightness: number,
		color_mode: number,
		color_temp: number,
		rgb: number,
		hue: number,
		sat: number
	}
	error: string
}

export enum Method {
	"toggle" = "toggle",
}