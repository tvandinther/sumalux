import * as express from 'express';
import suncalc from 'suncalc';
import * as path from 'path';

import { MongoConnector } from "./mongo-connector";
import LightController from './lights';

const app: express.Application = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../../client/dist/sumalux')));

const mongoConnector: MongoConnector = new MongoConnector({
	host: '127.0.0.1',
	dbName: 'sumalux',
})
mongoConnector.connect().then(startService).catch(err => console.log(err));

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../../client/dist/sumalux', 'index.html'))
})

app.listen(8080);

function startService() {
	console.log(mongoConnector)
	const lightController = new LightController(mongoConnector.getDb())
	app.get('/api/light/*', (req, res) => lightController.get(req, res));
	app.post('/api/light/*', (req, res) => lightController.post(req, res));

	// Listen to the App Engine-specified port, or 8080 otherwise
	const PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}...`);
	});
}
