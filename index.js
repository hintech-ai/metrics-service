const url = require("url");
const Buffer = require("buffer");
const https = require("https");
const format = require("./utils.js").format;

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
        const options = {
          hostname: dsn.hostname,
          path: dsn.pathname,
          method: "POST",
          headers: {
            "Content-Length": message.length,
          },
        };

        const req = https.request(options, (res) => {
          console.log(`metrics ${message} status: ${res.statusCode}`);
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

  const enrich = {
    ...(process.env.APP_ENV && { APP_ENV: process.env.APP_ENV }),
    ...(process.env.HOSTNAME && { HOSTNAME: process.env.HOSTNAME }),
    ...(process.env.NODE_ENV && { NODE_ENV: process.env.NODE_ENV }),
  };

  const globalTags = Object.keys(process.env)
    .filter((key) => key.includes("GLOBAL_METRIC_"))
    .reduce((cur, key) => {
      return Object.assign(cur, {
        [key.replace("GLOBAL_METRIC_", "")]: process.env[key],
      });
    }, {});

  tags = { ...enrich, ...globalTags, ...tags };

  const message = format(mesurement, fields, tags, timestamp);

  client(message);
};

module.exports = sendMetric;
