import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { artists } from "./modules/artists";
import { artist } from "./modules/artist";
import { mixcloudAudio } from "./modules/mixcloudAudio";
import { createSpotifyToken } from "./modules/createSpotifyToken";
import { artistAlbum } from "./modules/artistAlbum";
import { search } from "./modules/search";
import { devicePlayback, spotifyPlayback } from "./modules/spotifyPlayback";
import { soundcloudAudio } from "./modules/soundcloudAudio";
import { playlists } from "./modules/playlists";

const app = express();
const main = express();

app.use(cors({ origin: true }));
main.use(bodyParser.json());
main.use("/api", app);
// main.use(cors({ origin: true }));
main.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// eslint-disable-next-line max-len
export const api = functions.runWith({ memory: "2GB", timeoutSeconds: 540 }).https.onRequest(main);
app.get("/artists", artists);
app.post("/artist", artist);
app.post("/mixcloud-audio", mixcloudAudio);
app.get("/soundcloud-audio", soundcloudAudio);
app.get("/spotify-playback", spotifyPlayback);
app.get("/device-playback", devicePlayback);
app.get("/create-spotify-token", createSpotifyToken);
app.get("/artist-album", artistAlbum);
app.get("/search", search);
app.get("/playlists", playlists);
