import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {feed} from "./modules/feed";

const app = express();
const main = express();

app.use(cors({origin: true}));
main.use(bodyParser.json());
main.use("/api", app);
main.use(cors({origin: true}));
main.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

export const api = functions.runWith({memory: "2GB", timeoutSeconds: 540})
    .https.onRequest(main);

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

app.get("/feed", feed);

