export interface Light {
	readonly vendor: string,
	ip: string,
	port: number,
	name: string,
	owner: string, // User ID
}

export interface LightState {
	[key: string]: any,
}