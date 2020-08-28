import { Light, LightState } from "../lights/light";

export default interface LightsModel {

	// database: any;
	// lights: any;
	// lightGroups: any;
	// lightGroupUsers: any;

	addLights: (lights: Light[], vendor: string) => void;
	getLight: (lightId: string) => Promise<Light>;
	getAllLights: () => Promise<Light[]>;
	updateLightState: (lightId: string, newState: LightState) => Promise<any>;
}