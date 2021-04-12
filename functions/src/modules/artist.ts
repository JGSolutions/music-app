/* eslint-disable max-len */
/* eslint-disable guard-for-in */
import {Response, Request} from "express";
import {adminFirebase} from "./fb";
import {keys} from "lodash";
import {MixcloudSDK} from "../../sdk/mixcloud.sdk";

const db = adminFirebase.firestore();


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const artist = async (request: Request, response: Response) => {
  // console.log(request);
  const decodedUID = Buffer.from(request.headers["authorization"] as string, "base64").toString("ascii");
  const connectedServices = await db.collection("connectedServices").doc(decodedUID).get();
  const g = connectedServices.data() as FirebaseFirestore.DocumentData;
  const platformKeys = keys(connectedServices.data());
  let mixcloudPromiseData;

  platformKeys.forEach((key) => {
    MixcloudSDK.initialize(g[key].token);
    mixcloudPromiseData = MixcloudSDK.following();
  });

  Promise.all([mixcloudPromiseData]).then((promiseData: any[]) => {
    const [mixcloud] = promiseData;
    // const d = mixcloudDataModel(mixcloud);

    response.status(200).send(mixcloud);
  });
};
