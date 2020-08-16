import { Light } from "./light";

export interface Yeelight extends Light {
	model: string,
	methods: string[],
	vendor: "yeelight",
	state: YeelightState,
}

export interface YeelightState {
	on: boolean,
	brightness: number,
	color_mode: number,
	color_temp: number,
	rgb: number,
	hue: number,
	sat: number
}