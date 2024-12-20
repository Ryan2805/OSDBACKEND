import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const uri = process.env.DB_CONN_STRING || "";
const dbName = process.env.DB_NAME || "";

if (!uri || !dbName) {
  throw new Error("Database connection string or database name is missing in the .env file.");
}

const client = new MongoClient(uri);
let db: Db;
export let usersCollection: Collection;
export let drinksCollection: Collection;

// Connect to the database
export const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db(dbName);

    // Initialize both collections
    usersCollection = db.collection("users");
    drinksCollection = db.collection("drinks");

    console.log(`Successfully connected to MongoDB database: ${dbName}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
