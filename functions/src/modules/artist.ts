/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
// import { flatten, keys, reduce } from "lodash";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { IPlatformTypes } from "../../sdk/IPlatforms.types";
import { SpotifySDK } from "../../sdk/spotify.sdk";
// eslint-disable-next-line @typescript-eslint/no-var-requires

const db = adminFirebase.firestore();

interface ArtistBodyRequest {
  type: string;
  id: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const artist = async (request: Request, response: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const authorized = request.headers["authorization"]!;
  let requestBody: ArtistBodyRequest[];

  try {
    requestBody = JSON.parse(request.body);
  } catch (err) {
    response.status(403).send("Invalid Body Request");
    return;
  }

  if (!authorized) {
    response.status(401).send("Invalid authenticated");
  }

  try {
    await adminFirebase.auth().getUser(authorized);
  } catch (err) {
    response.status(401).send(err);
    return;
  }

  const connectedServicesRef = await db.collection("connectedServices").doc(authorized).get();
  const connectedServices = connectedServicesRef.data() as FirebaseFirestore.DocumentData;

  requestBody.forEach(async (key: ArtistBodyRequest) => {
    switch (key.type) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key.type].token);
        // pData.push(MixcloudSDK.following());
        break;
      case IPlatformTypes.spotify:
        SpotifySDK.initialize(connectedServices[key.type].token);
        // pData.push(SpotifySDK.following("artist"));
        break;
    }
  });

  response.status(200).send(connectedServices);

  // Promise.all(pData).then((promiseData: any[]) => {
  // });
};
