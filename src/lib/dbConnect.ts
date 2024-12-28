import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

// Initialize connection object
const connection: connectionObject = {
  isConnected: 0,
};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database because nextjs running on edge servers
  if (connection.isConnected) {
    console.log("Already connected to database!");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    // console.log(db); //check

    connection.isConnected = db.connections[0].readyState;
    // console.log(db.connections); //check

    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Error connecting to database: ", error);
    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;
