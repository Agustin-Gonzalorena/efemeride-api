import express, { json } from "express";
import cors from "cors";
import { startCron, readDb } from "./src/changeDate.js";
import { config } from "dotenv";
config();

// chequeo inicial y comienzo de chequeo diario
startCron();

const app = express();
app.use(json());
app.disable("x-powered-by");
app.use(cors());
app.options("*", cors());

const SHARED_KEY = process.env.SHARED_KEY;

app.use("/myapi", (req, res, next) => {
  const sharedKey = req.headers["x-shared-key"];
  if (sharedKey !== SHARED_KEY) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }
  next();
});

app.get("/myapi", (req, res) => {
  const db = readDb();
  const last = db.results[db.results.length - 1];
  res.json(last);
});

const PORT = 10301;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
