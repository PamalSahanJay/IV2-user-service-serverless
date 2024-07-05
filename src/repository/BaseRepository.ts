import { databaseClient } from "../utility/databaseClient";

export class BaseRepository {
  constructor() {

  }

  public async executeQuery(queryString: string, values: unknown[]) {
    try {
      const client = await databaseClient();
      await client.connect();
      const result = await client.query(queryString, values);
      client.end();
      return result;
    } catch (error) {
      console.log("DB connection error", error.message);
      throw new Error("DB connection error");
    }
  }
}