import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MikroORM } from "@mikro-orm/postgresql"; 
import mikroConfig from "./mikro-orm.config.js";
import requestLogRoutes from "./routes/requestLog.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors({
  origin:"https://rest-client-application.vercel.app"
}));
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
