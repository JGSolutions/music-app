/* eslint-disable guard-for-in */
import {Response, Request} from "express";
import {adminFirebase} from "./fb";
import {MixcloudSDK} from "../../sdk/mixcloud.sdk";
const db = adminFirebase.firestore();

export interface Feed {
  name: string;
  createdTime: string;
  updatedTime: string;
  tags: string[],
  pictures: Pictures
}

export interface Pictures {
  large: string;
  exLarge: string;
  xLarge: string;
}

export interface MixcloudTags {
  key: string;
  url: string;
  name: string;
}

export const mixcloudDataModel = (mixcloud: any): Feed[] => {
  const formattedData: Feed[] = [];

  mixcloud.forEach((bb: any) => {
    bb.cloudcasts.forEach((c: any) => {
      formattedData.push({
        name: c.name,
        createdTime: c.created_time,
        updatedTime: c.updated_time,
        tags: c.tags.map((tag: MixcloudTags) => tag.name),
        pictures: {
          large: c.pictures.large,
          exLarge: c.pictures.extra_large,
          xLarge: c.pictures["1024wx1024h"],
        },
      });
    });
  });

  return formattedData;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const feed = async (request: Request, response: Response) => {
  const connectedServices = await db.collection("connectedServices").get();
  let mixcloudPromiseData;

  connectedServices.forEach(async (doc) => {
    MixcloudSDK.initialize(doc.data()["mixcloud"].token);
    mixcloudPromiseData = MixcloudSDK.feed();
  });

  Promise.all([mixcloudPromiseData]).then((promiseData: any[]) => {
    const [mixcloud] = promiseData;
    const d = mixcloudDataModel(mixcloud);

    response.status(200).send(d);
  });
};
