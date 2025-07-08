import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MikroORM } from "@mikro-orm/postgresql"; // use driver-specific ORM
import mikroConfig from "./db/mikro-orm.config.js";
import requestLogRoutes from "./routes/requestLog.routes.js";

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

let orm;

const start = async () => {
  orm = await MikroORM.init(mikroConfig);
  await orm.getSchemaGenerator().updateSchema();

  //Use full CRUD /history routes
  app.use('/history', requestLogRoutes(orm));

  //Start server
  app.listen(PORT, () => {
    console.log(`YOO CHAL RHA SERvEr REPRESENTING http://localhost:${PORT}`);
  });
};

start();
