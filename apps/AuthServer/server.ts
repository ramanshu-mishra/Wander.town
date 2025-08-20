import express from "express";
import expressSession from "express-session";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
import { PrismaClient } from "@repo/database/prisma";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from "passport";
import router from "./routes/route.js";

const app = express();
app.use(express.json());
app.use(cors());


app.use(expressSession({
  secret: process.env.JWT_SECRET as string,
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(new PrismaClient() as any, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  } as any),  
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(router);


app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.use((err:Error, req:any, res:any, next:any) => {
  console.error(err);
  res.status(500).json({ message: "Server Error", error: err.message });
});

app.listen(3000, () => {
  console.log("listening at port 3000");
});
