import { Light } from "./light";

export interface Yeelight extends Light {
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
}