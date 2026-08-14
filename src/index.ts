import { app } from "./app";
import { connectDB } from "./db/connect";

const PORT = Bun.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server is runnin on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database Connection Failed", error);
  });
