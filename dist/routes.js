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
exports.default = default_1;
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const testRPC_1 = __importDefault(require("./testRPC"));
const mintRouteNFT_1 = __importDefault(require("./mintRouteNFT"));
const keygen_and_airdrop_1 = __importDefault(require("./keygen_and_airdrop"));
// chiama una funzione esportata
// uploadNft();
function default_1(app) {
    // Secret key per JWT da mettere dentro .env
    //const SECRET_KEY = process.env.SECRET_KEY;
    const SECRET_KEY = "zoelounge";
    // Configurazione di multer per l'upload dei file
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'src/uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
            //cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only jpeg, jpg, png, and pdf files are allowed'));
        }
    };
    const upload = (0, multer_1.default)({ storage: storage });
    // const upload = multer({
    //     storage: storage
    //     //fileFilter: fileFilter
    // });
    app.get("/", authenticateToken, (req, res) => {
        res.send("Root: / Called");
    });
    app.get("/test_rpc", authenticateToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var obj = null; //l'oggetto in risposta alla call epr adesso vuoto
        const test_rpc_obj = yield (0, testRPC_1.default)();
        obj = {
            response: 200,
            message: "test_rpc ok",
            test_rpc_obj: test_rpc_obj
        };
        res.json(obj);
    }));
    app.get("/keygen", authenticateToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var obj = null; //l'oggetto in risposta alla call epr adesso vuoto
        const responseKeyGen = yield (0, keygen_and_airdrop_1.default)();
        obj = {
            response: 200,
            message: "keygenAndAirdrop ok",
            responseKeyGen: responseKeyGen
        };
        res.json(obj);
    }));
    // Route per l'upload dei file: ancora da provare
    app.post('/upload', authenticateToken, upload.single('recfile'), (req, res) => {
        console.log("/upload: called");
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
    app.post("/mintRouteNFT", authToken, (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log(`/mintRouteNFT called`);
        console.log(`/mintRouteNFT req.body:`, req.body);
        console.log(`/mintRouteNFT req.body[image_media_name]:`, req.body['image_media_name']);
        var obj = null; //l'oggetto in risposta alla call epr adesso vuoto
        // ritorna il link 
        const objResultMintAndTransfer = yield (0, mintRouteNFT_1.default)(req, res);
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
        }
        else {
            console.log("objResultMintAndTransfer dentor ELSE is:", objResultMintAndTransfer);
            obj = {
                response: 200,
                message: "objResultMintAndTRansfer ok",
                objResultMintAndTRansfer: objResultMintAndTransfer
            };
            res.status(200).send({ status: 200, message: 'File Minted Congratulation!', obj: objResultMintAndTransfer });
        }
    }));
    // Middleware per verificare il token:
    function authToken(req, res, next) {
        console.log(`[server]: Server: authToken called`);
        let token = req.header('Authorization');
        console.log(`[server]: Server: authToken token: `, token === null || token === void 0 ? void 0 : token.split(" ")[1]);
        token = token === null || token === void 0 ? void 0 : token.split(" ")[1];
        if (!token)
            return res.status(401).send({ status: 401, message: 'Access Denied' });
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
            if (err)
                return res.status(403).send({ status: 403, message: 'Invalid Token' });
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
    app.get("/healthcheck", (req, res) => res.sendStatus(200));
    // Route per il login:
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        console.log("/login:", req.body);
        // Validazione dell'utente (qui semplificata)
        if (username === 'mvpSolana' && password === 'psw?123') {
            const token = jsonwebtoken_1.default.sign({ username: username }, SECRET_KEY, { expiresIn: '12h' });
            res.status(200).send({ status: 200, message: 'Login successful', token: token });
        }
        else {
            res.status(401).send({ status: 401, message: 'Invalid credentials' });
        }
    });
    // Middleware per verificare il token: 
    function authenticateToken(req, res, next) {
        console.log(`[server]: Server: authenticateToken called`);
        let token = req.header('Authorization');
        console.log(`[server]: Server: authenticateToken token: `, token === null || token === void 0 ? void 0 : token.split(" ")[1]);
        token = token === null || token === void 0 ? void 0 : token.split(" ")[1];
        if (!token)
            return res.status(401).send({ message: 'Access Denied' });
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
            if (err)
                return res.status(403).send({ message: 'Invalid Token' });
            req.body = user;
            next();
        });
    }
    // Una route protetta di esempio ok 
    app.get('/protected', authenticateToken, (req, res) => {
        console.log(`[server]: Server: /protected`);
        res.status(200).send({ message: 'This is a protected route', user: req.body });
    });
}
