/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
// import { flatten, keys, reduce } from "lodash";
import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { IPlatformTypes } from "../../sdk/IPlatforms.types";
// import { SpotifySDK } from "../../sdk/spotify.sdk";
// eslint-disable-next-line @typescript-eslint/no-var-requires

const db = adminFirebase.firestore();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const artist = async (request: Request, response: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const authorized = request.headers["authorization"]!;
  const requestBody = JSON.parse(request.body);

  if (!requestBody) {
    response.status(403).send("Invalid Body Request");
  }

  if (!authorized) {
    response.status(401).send("Invalid authenticated");
  }

  // try {
  await adminFirebase.auth().getUser(authorized);
  const connectedServicesRef = await db.collection("connectedServices").doc(authorized).get();
  const connectedServices = connectedServicesRef.data() as FirebaseFirestore.DocumentData;

  requestBody.forEach(async (key: any) => {
    switch (key.type) {
      case IPlatformTypes.mixcloud:
        MixcloudSDK.initialize(connectedServices[key.type].token);
        // pData.push(MixcloudSDK.following());
        break;
      case IPlatformTypes.spotify:
        // SpotifySDK.initialize(connectedServices[key].token);
        // pData.push(SpotifySDK.following("artist"));
        break;
    }
  });

  response.status(200).send(connectedServices);
  // } catch (err) {
  //   response.status(401).send(err);
  // }

  // Promise.all(pData).then((promiseData: any[]) => {
  // });
};
