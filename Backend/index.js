import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MikroORM } from "@mikro-orm/postgresql";
import mikroConfig from "./db/mikro-orm.config.js";
import requestLogRoutes from "./routes/requestLog.routes.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();


if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: "http://localhost:5173", 
  }));
} else {
  app.use(cors());
}

app.use(express.json());

let orm;

const start = async () => {
  orm = await MikroORM.init(mikroConfig);
  await orm.getSchemaGenerator().updateSchema();

  // API routes
  app.use('/history', requestLogRoutes(orm));

  // Static file serving in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

start().catch(err => {
  console.error(' Error starting server:', err);
});
