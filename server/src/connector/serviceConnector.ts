import LightsModel from "./lights.model"

export default interface ServiceConnector {
	connected: boolean;
	host: string;
	port: number;
	lightsModel: LightsModel;

	connect: () => any,
}