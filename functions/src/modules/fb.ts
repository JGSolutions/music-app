import * as admin from 'firebase-admin';
// export const adminFirebase = admin.initializeApp(functions.config().fb);

import 'firebase-functions';
export const adminFirebase = admin.initializeApp();