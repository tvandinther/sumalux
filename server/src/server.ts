import * as express from 'express';
import suncalc from 'suncalc';
import * as path from 'path';

import { Connector } from "./connector";
import LightController from './lights';
import { env } from 'process';

const app: express.Application = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../../client/dist/sumalux')));

const connector: Connector = new Connector({
	service: "redis",
	host: "localhost",
	port: 6379,
})
connector.connect().then(startService);

function startService() {
	const lightController = new LightController(connector);
	app.get('/api/light/*', (req, res) => lightController.get(req, res));
	app.post('/api/light/*', (req, res) => lightController.post(req, res));

	// Listen to the App Engine-specified port, or 8080 otherwise
	const PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}...`);
	});
}
