import { Light } from "../light";

export interface VendorController {
	discover: () => Promise<Light[]>,
}