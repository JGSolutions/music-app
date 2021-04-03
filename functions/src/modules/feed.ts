import {Response, Request} from "express";
// import {adminFirebase} from './fb';

// const db = adminFirebase.firestore();

export const feed = (request: Request, response: Response): void => {
  response.status(200).send(null);
};
