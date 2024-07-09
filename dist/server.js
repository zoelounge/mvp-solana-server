"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//https://blog.logrocket.com/how-to-set-up-node-typescript-express/#watching-file-changes
// src/index.js
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = __importDefault(require("./logger/logger"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// Middleware
app.use(body_parser_1.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use((0, cors_1.default)());
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
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    logger_1.default.info(`[server]: Server is running at http://localhost:${port}`);
    //const connection = await connect();
    (0, routes_1.default)(app);
}));
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
