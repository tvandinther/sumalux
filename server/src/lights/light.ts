export interface Light {
	readonly vendor: string,
	host: string,
	port: number,
	name: string,
	owner: string, // User ID
}