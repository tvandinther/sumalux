import { LightState } from "../light"

export interface LightResponse {
	success: Boolean,
	state: LightState
}