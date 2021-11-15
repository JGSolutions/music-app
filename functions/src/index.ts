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
import { playlists, playlistDetails, deletePlaylist, deletePlaylistTracks} from "./modules/playlists";
import { authentication } from "./middleware/auth";

const app = express();
const main = express();

app.use(cors({ origin: true }));
main.use(bodyParser.json());
main.use("/api", app);
// main.use(cors({ origin: true }));
main.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// eslint-disable-next-line max-len
export const api = functions.runWith({ memory: "2GB", timeoutSeconds: 540 }).https.onRequest(main);
app.get("/artists", authentication, artists);
app.post("/artist", authentication, artist);
app.post("/mixcloud-audio", mixcloudAudio);
app.get("/soundcloud-audio", authentication, soundcloudAudio);
app.get("/spotify-playback", authentication, spotifyPlayback);
app.get("/device-playback", authentication, devicePlayback);
app.get("/create-spotify-token", authentication, createSpotifyToken);
app.get("/artist-album", authentication, artistAlbum);
app.get("/search", authentication, search);
app.get("/playlists", authentication, playlists);
app.get("/playlistDetails", authentication, playlistDetails);
app.delete("/deletePlaylist", authentication, deletePlaylist);
app.delete("/deletePlaylistTracks", authentication, deletePlaylistTracks);
