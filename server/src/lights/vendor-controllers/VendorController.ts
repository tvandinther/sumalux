import { Light } from "../light";

export interface VendorController {
	discover: () => Promise<Light[]>,

	toggle: (light: Light) => any,
	setPower: (light: Light, power: Boolean) => any,
	setBrightness: (light: Light, brightness: Number) => any,
	setRGB: (light: Light, rgb: any) => any,
}