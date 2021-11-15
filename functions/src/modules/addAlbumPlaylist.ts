/**
 * @TODO:
 * Not used anymore. Was tested to add all tracks from an album. But
 * was complex to handle. Maybe in future.
*/
import { Response, Request } from "express";
import { IPlatformTypes } from "../../../models/artist.types";
import { adminFirebase } from "../config/fb";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { getConnectServices } from "../utils/connect-services-firebase";
import { spotifyKeys } from "../../sdk/api-keys";
import { IAlbum } from "../../../models/song.types";

const db = adminFirebase.firestore();
const auth = adminFirebase.auth();

export const addAlbumPlaylist = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;
  const platform = request.query.platform;
  const albumid = request.query.albumid;
  const playlistid = request.query.playlistid;

  let res: IAlbum;

  try {
    await auth.getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServices = await getConnectServices(authorized);

  switch (platform) {
    case IPlatformTypes.spotify:
      // eslint-disable-next-line max-len
      SpotifySDK.initialize(connectedServices[platform].token, connectedServices[platform].refresh_token, spotifyKeys.clientId, spotifyKeys.secretApi, authorized);
      res = await SpotifySDK.getArtistAlbum(albumid as string);

      res.tracks.forEach(async (data) => {
        const song = {
          id: data?.id,
          name: data?.name,
          albumid: res.album.id,
          albumName: res.album.name,
          platform: data?.platform,
          playlists: [playlistid],
          duration: data?.duration,
          durationType: data?.durationType,
          trackType: data?.trackType,
        };
        await db.collection("playlistTracks").doc(authorized).collection("list").doc(data.id).set(song, { merge: true });
      });

      break;
  }

  return response.status(200).send("done");
};
