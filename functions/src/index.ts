import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { feed } from "./modules/feed";
import { artists } from "./modules/artists";
import { artist } from "./modules/artist";

const app = express();
const main = express();

app.use(cors({ origin: true }));
main.use(bodyParser.json());
main.use("/api", app);
main.use(cors({ origin: true }));
main.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// eslint-disable-next-line max-len
export const api = functions.runWith({ memory: "2GB", timeoutSeconds: 540 }).https.onRequest(main);
app.get("/feed", feed);
app.get("/artists", artists);
app.post("/artist", artist);

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
