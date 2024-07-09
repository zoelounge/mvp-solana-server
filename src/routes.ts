import express, { Express, NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from 'multer';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import path from 'path';


// Iporto un file 
import log from "./logger/logger";
import testRPC from "./testRPC";
import uploadMediaForNft from "./uploadNftMedia";
import uploadNFTMetadata from "./splUploadNFTMetadata";
import mintRouteNFTAction from "./mintRouteNFT";
import { ObjResultMintAndTRansfer } from "./mintNFT";
import keygenAndAirdrop from "./keygen_and_airdrop";
import dotenv from "dotenv";
var fs = require('fs');


// chiama una funzione esportata
// uploadNft();

export default function (app: Express) {

    // Secret key per JWT da mettere dentro .env
    //const SECRET_KEY = process.env.SECRET_KEY;
    const SECRET_KEY = "zoelounge";
    //var dir = './tmp';


    // Configurazione di multer per l'upload dei file
    const storage = multer.diskStorage({

        // destination: function (req, file, cb) {
        //     cb(null, 'src/uploads/');
        // },
        // destination: function (req, file, cb) {
        //     cb(null, dir);
        // },
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
            //cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only jpeg, jpg, png, and pdf files are allowed'));
        }
    };

    const upload = multer({ storage: storage });
    const uploader = multer({ dest: "uploads/" });

    // const upload = multer({
    //     storage: storage
    //     //fileFilter: fileFilter
    // });


    // Route per l'upload dei file: ancora da provare test con uploadr invece che con upload.single
    app.post('/upload', authenticateToken, uploader.single('recfile'), (req: Request, res: Response) => {
        console.log("/upload: called: ok ");
        console.log(`/upload: folder __dirname:`, __dirname);

        // if (!fs.existsSync(dir)) {
        //     console.log(`folder upload non esiste la creo`);
        //     fs.mkdirSync(dir);
        //     console.log(`folder upload creata`);
        // } else {
        //     console.log(`folder upload esiste`);
        // }
        // console.log(`/upload: folder __dirname:`, __dirname);

        if (!req.file) {
            return res.status(400).send({ status: 400, message: 'Please upload a file', filePath: "", filename: "" });
        }
        const filePath = req.file.path;
        const filename = req.file.filename;
        console.log("/upload: filePath:", filePath);
        console.log("/upload: filename:", filename);

        // TODO: Integrate with Metaplex IrysUploader

        res.status(200).send({ status: 200, message: 'File uploaded successfully', filePath: filePath, filename: filename });
    });


    app.get("/", authenticateToken, (req: Request, res: Response) => {
        res.send("Root: / Called");
    });

    app.get("/test_rpc", authenticateToken, async (req: Request, res: Response) => {
        var obj = null; //l'oggetto in risposta alla call epr adesso vuoto
        const test_rpc_obj = await testRPC();
        obj = {
            response: 200,
            message: "test_rpc ok",
            test_rpc_obj: test_rpc_obj
        };
        res.json(obj);
    });


    app.get("/keygen", authenticateToken, async (req: Request, res: Response) => {
        var obj = null; //l'oggetto in risposta alla call epr adesso vuoto
        const responseKeyGen = await keygenAndAirdrop();
        obj = {
            response: 200,
            message: "keygenAndAirdrop ok",
            responseKeyGen: responseKeyGen
        };
        res.json(obj);
    });




    app.post("/mintRouteNFT", authToken, async (req: Request, res: Response) => {
        console.log(`/mintRouteNFT called`);
        console.log(`/mintRouteNFT req.body:`, req.body);
        console.log(`/mintRouteNFT req.body[image_media_name]:`, req.body['image_media_name']);

        var obj = null; //l'oggetto in risposta alla call epr adesso vuoto

        // ritorna il link 
        const objResultMintAndTransfer = await mintRouteNFTAction(req, res);

        // obj = {
        //     response: 200,
        //     message: "mintNFT test",
        //     objResultMintAndTRansfer: null
        // };
        // res.json(obj);
        console.log("objResultMintAndTransfer is:", objResultMintAndTransfer);

        if (objResultMintAndTransfer == null || objResultMintAndTransfer === null) {

            console.log("objResultMintAndTransfer dentor IF is:", objResultMintAndTransfer);

            obj = {
                response: 400,
                message: "objResultMintAndTRansfer problem",
                objResultMintAndTRansfer: null
            };
            res.status(400).send({ status: 400, message: 'File Minted problem!' });

        } else {
            console.log("objResultMintAndTransfer dentor ELSE is:", objResultMintAndTransfer);

            obj = {
                response: 200,
                message: "objResultMintAndTRansfer ok",
                objResultMintAndTRansfer: objResultMintAndTransfer
            };
            res.status(200).send({ status: 200, message: 'File Minted Congratulation!', obj: objResultMintAndTransfer });

        }
    });


    // Middleware per verificare il token:
    function authToken(req: Request, res: Response, next: NextFunction) {
        console.log(`[server]: Server: authToken called`);
        let token = req.header('Authorization');
        console.log(`[server]: Server: authToken token: `, token?.split(" ")[1]);
        token = token?.split(" ")[1];
        if (!token) return res.status(401).send({ status: 401, message: 'Access Denied' });

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.status(403).send({ status: 403, message: 'Invalid Token' });
            next();
        });
    }

    // // single operazioni
    // app.get("/uploadMediaToArweave", async (req: Request, res: Response) => {
    //     log.info(`/uploadMediaToArweave called`);
    //     var obj = null;
    //     let image_media_name = "LaureaMasterZSol.pdf";
    //     const nftUri = await uploadMediaForNft(image_media_name);
    //     log.info(`NftUri uri is: ${nftUri}`);

    //     if (nftUri !== null) {
    //         obj = {
    //             response: 200,
    //             message: "splUploadNFTMetadata ok",
    //             nftUri: nftUri
    //         };
    //         res.json(obj);
    //     } else {
    //         obj = {
    //             response: 400,
    //             message: "uploadMediaToArweave problem",
    //             uri: null
    //         };
    //         res.json(obj);
    //     }
    // });

    // app.get("/splUploadNFTMetadata", async (req: Request, res: Response) => {
    //     log.info(`/splUploadNFTMetadata called`);
    //     var obj = null;

    //     const nftUri = await uploadNFTMetadata(null);
    //     log.info(`nftUri is: ${nftUri}`);

    //     if (nftUri !== null) {
    //         obj = {
    //             response: 200,
    //             message: "splUploadNFTMetadata ok",
    //             nftUri: nftUri
    //         };
    //         res.json(obj);
    //     } else {
    //         obj = {
    //             response: 400,
    //             message: "splUploadNFTMetadata problem",
    //             nftUri: null
    //         };
    //         res.json(obj);
    //     }


    // });


    // Route di test
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));



    // Route per il login:
    app.post('/login', (req: Request, res: Response) => {
        const { username, password } = req.body;
        console.log("/login:", req.body);

        // Validazione dell'utente (qui semplificata)
        if (username === 'mvpSolana' && password === 'psw?123') {
            const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '12h' });
            res.status(200).send({ status: 200, message: 'Login successful', token: token });
        } else {
            res.status(401).send({ status: 401, message: 'Invalid credentials' });
        }
    });

    // Middleware per verificare il token: 
    function authenticateToken(req: Request, res: Response, next: NextFunction) {
        console.log(`[server]: Server: authenticateToken called`);

        let token = req.header('Authorization');
        console.log(`[server]: Server: authenticateToken token: `, token?.split(" ")[1]);
        token = token?.split(" ")[1];

        if (!token) return res.status(401).send({ message: 'Access Denied' });

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.status(403).send({ message: 'Invalid Token' });
            req.body = user;
            next();
        });
    }


    // Una route protetta di esempio ok 
    app.get('/protected', authenticateToken, (req: Request, res: Response) => {
        console.log(`[server]: Server: /protected`);
        res.status(200).send({ message: 'This is a protected route', user: req.body });
    });

}



