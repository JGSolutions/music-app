/* eslint-disable max-len */
/* eslint-disable guard-for-in */
import {Response, Request} from "express";
import {adminFirebase} from "./fb";
import {keys} from "lodash";
import {MixcloudSDK} from "../../sdk/mixcloud.sdk";

const db = adminFirebase.firestore();


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const artists = async (request: Request, response: Response) => {
  const decodedUID = Buffer.from(request.headers["authorization"] as string, "base64").toString("ascii");
  if (!decodedUID) {
    response.status(401).send("Not authenticated");
  }

  const connectedServicesRef = await db.collection("connectedServices").doc(decodedUID).get();
  const connectedServices = connectedServicesRef.data() as FirebaseFirestore.DocumentData;
  const platformKeys = keys(connectedServices.data());
  let mixcloudPromiseData;

  platformKeys.forEach((key) => {
    MixcloudSDK.initialize(connectedServices[key].token);
    mixcloudPromiseData = MixcloudSDK.following();
  });

  Promise.all([mixcloudPromiseData]).then((promiseData: any[]) => {
    const [mixcloud] = promiseData;
    // const d = mixcloudDataModel(mixcloud);

    response.status(200).send(mixcloud);
  });
};
