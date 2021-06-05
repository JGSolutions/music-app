/* eslint-disable max-len */
import { adminFirebase } from "../modules/fb";
import { IPlatformTypes } from "../../../models/artist.types";

const db = adminFirebase.firestore();

export const getConnectServices = async (uid: string) => {
  const connectedServicesRef = await db.collection("connectedServices").doc(uid).get();
  return connectedServicesRef.data() as FirebaseFirestore.DocumentData;
};

export const updateConnectedService = async (uid: string, token: string, platform: IPlatformTypes): Promise<FirebaseFirestore.WriteResult> => {
  return await db.collection("connectedServices").doc(uid).set({
    [platform]: {
      token: token,
    },
  }, { merge: true });
};
