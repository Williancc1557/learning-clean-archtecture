import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";

export const mongoHelper = {
  client: null as MongoClient,
  async connect(url: string): Promise<void> { // eslint-disable-line
    this.client = await MongoClient.connect(process.env.MONGO_URL);
  },

  async disconnect(): Promise<void> {
    await this.client.close;
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
};
