/* eslint-disable max-len */
import { Response, Request } from "express";
import { adminFirebase } from "./fb";
// import { flatten, keys, reduce } from "lodash";
// import { MixcloudSDK } from "../../sdk/mixcloud.sdk";
import { IPlatformTypes } from "../../sdk/IPlatforms.types";
// import { SpotifySDK } from "../../sdk/spotify.sdk";
// eslint-disable-next-line @typescript-eslint/no-var-requires

const db = adminFirebase.firestore();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const artist = async (request: Request, response: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const authorized = request.headers["authorization"]!;
  const requestBody = request.body;

  if (!requestBody) {
    response.status(403).send("Invalid");
  }

  if (!authorized) {
    response.status(401).send("Invlaid authenticated");
  }

  try {
    await adminFirebase.auth().getUser(authorized);
    const connectedServicesRef = await db.collection("connectedServices").doc(authorized).get();
    const connectedServices = connectedServicesRef.data() as FirebaseFirestore.DocumentData;

    // const platformKeys = keys(connectedServicesRef.data());
    // const pData: unknown[] = [];

    requestBody.forEach(async (key: any) => {
      switch (key.type) {
        case IPlatformTypes.mixcloud:
          console.log(key);
          // MixcloudSDK.initialize(connectedServices[key].token);
          // pData.push(MixcloudSDK.following());
          break;
        case IPlatformTypes.spotify:
          // SpotifySDK.initialize(connectedServices[key].token);
          // pData.push(SpotifySDK.following("artist"));
          break;
      }
    });

    response.status(200).send(connectedServices);
  } catch (err) {
    response.status(401).send("Not authenticated");
  }

  // Promise.all(pData).then((promiseData: any[]) => {
  // });
};
