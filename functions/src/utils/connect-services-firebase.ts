import { adminFirebase } from "../modules/fb";

export const getConnectServices = async (uid: string) => {
  const connectedServicesRef = await adminFirebase.firestore()
    .collection("connectedServices")
    .doc(uid).get();

  return connectedServicesRef.data() as FirebaseFirestore.DocumentData;
};
