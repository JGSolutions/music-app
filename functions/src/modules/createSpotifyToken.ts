import { Response, Request } from "express";
import { adminFirebase } from "../config/fb";
import { SpotifySDK } from "../../sdk/spotify.sdk";
import { IAuthorizationToken } from "../../../models/spotify.model";

const db = adminFirebase.firestore();

export const createSpotifyToken = async (request: Request, response: Response) => {
  const authorized = request.headers["authorization"]!;

  const data: IAuthorizationToken = await SpotifySDK.createAccessTokenUrl(request.query.code);
  const user = await SpotifySDK.accountInfo();

  db.collection("connectedServices").doc(authorized).set({
    "spotify": {
      token: data.access_token,
      refresh_token: data.refresh_token,
      product: user.product,
    },
  }, { merge: true });

  return response.status(200).send(data);
};
