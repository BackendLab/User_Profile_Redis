import express, { type Request, type Response } from "express";
import { User } from "./models/user.model";
import { redis } from "./db/connect";

export const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

// Crud for user profile
// register user and cache in redis
app.post("/user", async (req: Request, res: Response) => {
  // get the detrails from user for rtegistering
  const { name, email, bio } = req.body;
  // check if the data given really exists or not, if not return an error
  if (!name || !email || !bio) {
    return res.status(400).json({ message: "All Feilds are required!" });
  }
  // create the user in database
  const user = await User.create({ name, email, bio });
  // cache the data in redis
  await redis.hset(`user:${user._id}`, {
    name: user.name,
    email: user.email,
    bio: user.bio ?? "",
  });
  // delete the cache after 1 hr
  await redis.expire(`user:${user._id}`, 3600);

  // return the user
  res.status(200).json(user);
});

// Get the user profile data through redis
app.get("/user/:id", async (req: Request, res: Response) => {
  // get the id from url
  const { id } = req.params;
  // hit the redis to fetch the data
  const cached = await redis.hgetall(`user:${id}`);
  // check if the cached data exists or not, if exists then return that data
  if (Object.keys(cached).length > 0) {
    return res.status(200).json({ ...cached, source: "Cached" });
  }
  // if not exists then hit the databse to fetch the data
  const user = await User.findById(id);
  // check if user exists or not
  if (!user) {
    return res.status(404);
  }
  // after fetching through DB cache the data and set the ttl
  await redis.hset(`user:${id}`, {
    name: user?.name,
    email: user?.email,
    bio: user?.bio ?? "",
  });
  await redis.expire(`user:${id}`, 3600); // Time to live set for 1 hr
  // return the user
  res.status(200).json(user);
});
