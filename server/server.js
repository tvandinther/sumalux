const express = require('express');
const yeelightAPI = require('./server_api');
const suncalc = require('suncalc');
const app = express();

app.use(express.json());
app.use(express.static('client'));

app.post('/', (req, res) => {
    switch (req.body.type) {
        case 'scan':
            yeelightAPI.scan().then(resp => {
                res.send(resp);
            });
            break;
        case 'suncalc':
            res.send(yeelightAPI.getSuncalc(new Date(), req.body.days, -36.85, 174.78333));
    }
})

app.get('/api/yeelight/scan', (req, res) => {
	yeelightAPI.scan().then(resp => {
		res.send(resp);
	});
})

app.post('/api/yeelight/command', (req, res) => {
	yeelightAPI.command(req.body.target, req.body.method, req.body.parameters)
		.then(response => res.send(response)).catch(err => res.status(400).send(err));
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});