import { MONGODB_DB, MONGODB_URI } from "@/app/backend/config/constant";
import { MongoClient, Db, MongoClientOptions } from "mongodb";

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private readonly uri: string;
  private readonly dbName: string;
  private readonly options: MongoClientOptions;

  private constructor() {
    this.uri = MONGODB_URI;
    this.dbName = MONGODB_DB;

    this.options = {
      // Recommended options for modern MongoDB drivers
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
    };
  }

  /**
   * Singleton instance getter
   */
  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  /**
   * Connect to MongoDB (reuses connection in serverless environments)
   */
  public async connect(): Promise<Db> {
    if (this.db) return this.db;

    if (!this.client) {
      this.client = new MongoClient(this.uri, this.options);
      await this.client.connect();
    }

    this.db = this.client.db(this.dbName);
    return this.db;
  }

  /**
   * Close connection (optional, usually not used in serverless)
   */
  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}

// ✅ Cache the instance globally to persist across hot reloads and Vercel invocations
const globalForMongo = globalThis as unknown as {
  _mongoConnection?: MongoDBConnection;
};

const mongoConnection =
  globalForMongo._mongoConnection || MongoDBConnection.getInstance();

if (!globalForMongo._mongoConnection) {
  globalForMongo._mongoConnection = mongoConnection;
}

export default mongoConnection;
