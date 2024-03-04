import fs from "fs";
import cron from "node-cron";
import { consultOpenai } from "./openai.js";

const checkDate = async () => {
  const newDate = new Date();
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const fechaActual = `${day}/${month}`;
  let db = readDb();
  let last = db.results[db.results.length - 1];
  if (last.date !== fechaActual) {
    const responseApi = await consultOpenai(fechaActual);
    writeDb(fechaActual, responseApi, db);
  } else return;
};

export const readDb = () => {
  try {
    const data = fs.readFileSync("./src/db.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return;
  }
};

const writeDb = (date, responseApi, db) => {
  db.results.push({ date, fact: responseApi });
  try {
    const data = JSON.stringify(db);
    fs.writeFileSync("./src/db.json", data);
  } catch (err) {
    console.log(err);
  }
};

export const startCron = () => {
  checkDate();

  cron.schedule(
    "0 0 * * *",
    () => {
      checkDate();
    },
    {
      scheduled: true,
      timezone: "America/Argentina/Buenos_Aires",
    }
  );
};
