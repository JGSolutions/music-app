import { Response, Request } from "express";
import { adminFirebase } from "./fb";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { IAuthorizationToken } from "../../../models/spotify.model";

const db = adminFirebase.firestore();

export const createSpotifyToken = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const data: IAuthorizationToken = await SpotifySDK.createAccessTokenUrl(request.query.code);

  db.collection("connectedServices").doc(authorized).set({
    "spotify": {
      token: data.access_token,
      refresh_token: data.refresh_token,
    },
  }, { merge: true });

  return response.status(200).send(data);
};
