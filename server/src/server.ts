import * as express from 'express';
import suncalc from 'suncalc';

import { MongoConnector } from "./mongo-connector";
import LightController from './lights';

const app: express.Application = express();

app.use(express.json());
app.use(express.static('client'));

const mongoConnector: MongoConnector = new MongoConnector({
	host: 'localhost',
	dbName: 'sumalux',
})
mongoConnector.connect().then(startService);

function startService() {
	const lightController = new LightController(mongoConnector.getDb())
	app.get('/api/light/*', (req, res) => lightController.get(req, res));
	app.post('/api/light/*', (req, res) => lightController.post(req, res));

	// Listen to the App Engine-specified port, or 8080 otherwise
	const PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}...`);
	});
}
