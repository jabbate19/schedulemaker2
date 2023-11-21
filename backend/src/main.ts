import express from "express";
import config from './config';
import logger from "./logger";
import { generate } from "./handlers";

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  var ip = req.headers['X-Forwarded-For'] || req.socket.remoteAddress;
  // Log an info message for each incoming request
  res.on('finish', function() {
    logger.info(`${req.method} ${req.url} | ${res.statusCode} | ${ip}`);
  });
  next();
});

app.use("/api", router);

router.use("/generate", generate);

app.use((err, req, res, next) => {
  // Log the error message at the error level
  logger.error(`${req.method} ${req.url} | ${err.message}`);
  logger.error(JSON.stringify(req.body, null, 2));
  res.status(500).send();
});

app.listen(config.PORT, () => {
  logger.info(`Listening on port ${config.PORT}...`);
});

