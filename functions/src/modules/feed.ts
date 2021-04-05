import {Response, Request} from "express";
import {adminFirebase} from "./fb";

// const db = adminFirebase.firestore();

export const feed = async (request: Request, response: Response)
  : Promise<Response<any>> => {
  const db = adminFirebase.firestore();

  const connectedServices = await db.collection("connectedServices").get();
  // .doc(request.body.uid)

  return response.status(200).send(connectedServices);
};
