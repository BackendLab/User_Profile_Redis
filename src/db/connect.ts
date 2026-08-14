import mongoose from "mongoose";
import Redis from "ioredis";

export const redis = new Redis(Bun.env.REDIS_URL!);

redis.on("connect", () => {
  console.log("Redis Connected!");
});

redis.on("error", (error) => {
  console.error("Redis Connection Failed!", error);
});

export const connectDB = async (): Promise<void> => {
  // connect through mongoose
  try {
    const connectionInstance = await mongoose.connect(
      `${Bun.env.MONGO_URI}/${Bun.env.DB_NAME}`,
    );
    console.log(
      "Database connection established successfully!",
      "Host:",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.error("Database Connection Failed!", error);
    process.exit(1);
  }
};
