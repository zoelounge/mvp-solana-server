//https://blog.logrocket.com/how-to-set-up-node-typescript-express/#watching-file-changes
// src/index.js
import express, { Express, NextFunction, Request, Response } from "express";
import routes from "./routes";

import dotenv from "dotenv";
import multer, { FileFilterCallback } from 'multer';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import path from 'path';
import log from "./logger/logger";
import cors from 'cors';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());


// // Configurazione di multer per l'upload dei file
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'src/uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   const filetypes = /jpeg|jpg|png|pdf/;
//   const mimetype = filetypes.test(file.mimetype);
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only jpeg, jpg, png, and pdf files are allowed'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter
// });


// // // Secret key per JWT da mettere dentro .env
// // //const SECRET_KEY = process.env.SECRET_KEY;
// // const SECRET_KEY = "zoelounge";


// // Route per l'upload dei file
// app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(400).send({ message: 'Please upload a file' });
//   }
//   // Simulazione del caricamento del file su IrysUploader tramite Metaplex
//   const filePath = req.file.path;
//   // TODO: Integrate with Metaplex IrysUploader
//   res.status(200).send({ message: 'File uploaded successfully', file: filePath });
// });

// // Route per il login
// app.post('/login', (req: Request, res: Response) => {
//   const { username, password } = req.body;
//   // Validazione dell'utente (qui semplificata)
//   if (username === 'user' && password === 'password') {
//     const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
//     res.status(200).send({ message: 'Login successful', token: token });
//   } else {
//     res.status(401).send({ message: 'Invalid credentials' });
//   }
// });

// // Middleware per verificare il token
// function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   console.log(`[server]: Server: authenticateToken called`);

//   const token = req.header('Authorization');
//   if (!token) return res.status(401).send({ message: 'Access Denied' });

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.status(403).send({ message: 'Invalid Token' });
//     req.body = user;
//     next();
//   });
// }

// // Una route protetta di esempio
// app.get('/protected', authenticateToken, (req: Request, res: Response) => {
//   console.log(`[server]: Server: /protected`);
//   res.status(200).send({ message: 'This is a protected route', user: req.body });
// });


// app.get("/", (req: Request, res: Response) => {
//   res.send("Root: / Called");
// });

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  log.info(`[server]: Server is running at http://localhost:${port}`);
  //const connection = await connect();
  routes(app);
});



// for js
// const express = require("express");
// const dotenv = require("dotenv");

// dotenv.config();

// const app = express();
// const port = process.env.PORT;

// app.get("/", (req, res) => {
//   res.send("NodeJs + Express Server");
// });

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });
