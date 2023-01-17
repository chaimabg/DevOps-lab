const client = require('prom-client');
let register = new client.Registry();
client.collectDefaultMetrics({ register })

module.exports={client,register};