import express from "express";
import logger from "./logger"
import { helloWorld } from "./handlers";

const app = express();
const port = parseInt(Bun.env.PORT) || 8080;;

app.use((req, res, next) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // Log an info message for each incoming request
  res.on('finish', function() {
    logger.info(`${req.method} ${req.url} | ${res.statusCode} | ${ip}`);
  });
  next();
});

app.get("/", helloWorld);

app.use((err, req, res, next) => {
  // Log the error message at the error level
  logger.error(`${req.method} ${req.url} | ${err.message}`);
  res.status(500).send();
});

app.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});

