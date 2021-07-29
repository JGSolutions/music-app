import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { artists } from "./modules/artists";
import { artist } from "./modules/artist";
import { mixcloudAudio } from "./modules/mixcloudAudio";
import { createSpotifyToken } from "./modules/createSpotifyToken";
import { artistAlbum } from "./modules/artistAlbum";
import { adminFirebase } from "./modules/fb";
import { clone } from "lodash";

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
app.get("/create-spotify-token", createSpotifyToken);
app.get("/artist-album", artistAlbum);
// app.get("/add-album-playlist", addAlbumPlaylist);

exports.addPlaylistCoverImage = functions.firestore.document("playlistTracks/{uid}/list/{listId}").onCreate((snap) => {
  const data = snap.data();
  const objectId = snap.id;
  const db = adminFirebase.firestore();

  data.playlists.every(async (playlist: any) => {
    const query = await db.collection("playlist").doc(playlist).get();
    const playlistData = query.data()!;
    const coverImages = clone(playlistData.coverImages);

    if (coverImages.length >= 4) {
      return false;
    }

    coverImages.push({
      id: objectId,
      image: data.picture.medium,
    });

    await db.collection("playlist").doc(playlist).set({
      coverImages,
      updatedDate: new Date(),
    }, { merge: true });

    return true;
  });

  return true;
});

exports.updatePlaylistCoverImage = functions.firestore.document("playlistTracks/{uid}/list/{listId}").onUpdate((snap) => {
  const data = snap.after.data();
  const objectId = snap.before.id;

  const db = adminFirebase.firestore();

  data.playlists.every(async (playlist: any) => {
    const query = await db.collection("playlist").doc(playlist).get();
    const playlistData = query.data()!;
    const coverImages = clone(playlistData.coverImages);

    if (coverImages.length >= 4) {
      return false;
    }

    coverImages.push({
      id: objectId,
      image: data.picture.large,
    });

    await db.collection("playlist").doc(playlist).set({
      coverImages,
      updatedDate: new Date(),
    }, { merge: true });

    return true;
  });

  return true;
});
