const url = require('url')
const Buffer = require('buffer')
const https = require('https')
const format = require('./utils.js').format

const client = undefined;
const socket = undefined;

const getClient = () => {
  const host = process.env.METRICS_HOST;
  if (host) {
    const dsn = url.parse(process.env.METRICS_HOST);

    if (dsn.protocol == "udp:") {
      return (message) => {
        if (!socket) {
          socket = dgram.createSocket("udp4");
        }

        message = Buffer.from(message);
        socket.send(message, dsn.port, dsn.hostname, (err) => {
          socket.close();
        });
      };
    } else if (dsn.protocol == "https:") {
        return (message) => {
          console.log(message)
        const options = {
          hostname: dsn.hostname,
          path: dsn.pathname,
          method: "POST",
          headers: {
            "Content-Length": message.length,
          },
        };

        const req = https.request(options, (res) => {
        });

        req.on("error", (e) => {
          console.error(e);
        });

        req.write(message);
        req.end();
      };
    }
  }

  return client;
};

const sendMetric = (mesurement, fields, tags = {}, timestamp) => {
  const client = getClient();
  if (!client) {
    console.debug("No client configured");
    return;
  }
    
    
    client(format(mesurement, fields, tags, timestamp))
};

module.exports = sendMetric
