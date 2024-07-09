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
// serve installare UMI con "npm i @metaplex-foundation/umi-bundle-defaults"
// ci permetteranno di creare la nostra prima istanza di UMI
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
//signerIdentity utlizza su UMI il nostro Wallet come firmatario e lo usa lui di defaults
const umi_1 = require("@metaplex-foundation/umi");
const web3_js_1 = require("@solana/web3.js");
const promises_1 = __importDefault(require("node:fs/promises"));
let fs = require('fs');
let path = require('path');
// Utilizziamo IRYS per l'upload del file nft con "npm i metaplex-foundation/umi-uploader-irys"
const umi_uploader_irys_1 = require("@metaplex-foundation/umi-uploader-irys");
const key_file_json_1 = __importDefault(require("./key-file.json")); // serve per la fase di test altrimenti verremo limitati
const umi_web3js_adapters_1 = require("@metaplex-foundation/umi-web3js-adapters");
//var wallet = require('./key-file.json'); // posso importatrloa hce cosi 
function uploadMediaForNft(image_media_name, nft_name) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("uploadMediaForNft()");
        // come per il classico mint che usavamo const 
        // keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
        // facciamo lo stesso ma con le API di UMI istanziando il nostro umi 
        //const umi = createUmi("https://api.devnet.solana.com", "finalized");
        //const umi = createUmi("http://127.0.0.1:8899", "finalized");
        //const rpc_url = "https://api.devnet.solana.com";//process.env.SOLANA_RPC_USE;
        const rpc_url = process.env.SOLANA_RPC_USE;
        const umi = (0, umi_bundle_defaults_1.createUmi)(rpc_url, "finalized");
        console.log("uploadMediaForNft: umi.rpc.getBalance = ", umi.rpc.getBalance);
        // diciamo ad UMI che deve utilizzare irysUploader
        umi.use((0, umi_uploader_irys_1.irysUploader)());
        // il wallet con cui firmo l'upload del file
        let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(key_file_json_1.default));
        const myKeypairSigner = (0, umi_1.createSignerFromKeypair)(umi, keypair);
        // diciamo ad UMI che deve usare come signerIdentity il nostro myKeypairSigner in modo che non dobbiamo sempre specificarlo
        umi.use((0, umi_1.signerIdentity)(myKeypairSigner));
        console.log("uploadMediaForNft: umi use.signerIdentity ok");
        try {
            // test keypairUMI
            const connection = new web3_js_1.Connection(rpc_url, "finalized");
            console.log(" uploadMediaForNft: onnnection.rpcEndpoint = ", connection.rpcEndpoint);
            const umiPublickKey = (0, umi_web3js_adapters_1.toWeb3JsPublicKey)(myKeypairSigner.publicKey);
            let balanceUMI = yield connection.getBalance(umiPublickKey);
            console.log(`balanceUMI di myKeypairSigner is:  ${balanceUMI / web3_js_1.LAMPORTS_PER_SOL} SOL`);
            //var filePath = path.join(__dirname, '../asset/LaureaMasterZSol.pdf');
            //var filePath = path.join(__dirname, `./uploads/${image_media_name}`);
            console.log(`uploadMediaForNft: folder __dirname:`, __dirname);
            var filePath = path.join(__dirname, `../uploads/${image_media_name}`);
            console.log(`uploadMediaForNft: folder filePath:`, filePath);
            const media = yield promises_1.default.readFile(filePath);
            // prendiamo il nostro file image che dovrebbe rapprenstare il nostro NFT
            //const media = await readFile("./nft/nft-scooter.png");
            //const media = await readFile("../asset/LaureaMasterZSol.jpg");
            // trasformaimolo in qualcosa che possiamo uploadare su IRYS
            //const nft_media = createGenericFile(media, "scooter");
            //const nft_media = createGenericFile(media, nft_name); // Funziona ma non vedo il media sull'explorer
            const nft_media = (0, umi_1.createGenericFile)(media, nft_name, { contentType: "image/jpg" });
            // // potremmo usare uri: umi.uploader.upload ma resterebbe per poco su metaplex
            // // usiamo invece irys che resta per sempre sui suoi db decentralizzati 
            const [mediaUri] = yield umi.uploader.upload([nft_media]);
            // // ok abbiamo caricato il file e wui troveremo il link per scaricarlo (dobbiamo aggiiunge .png se volgiamo vederlo con preview)
            // // Adesso manca creare l' NFT coon i metadata: creaimo splMetadata.ts e facciamo tutto li
            console.log("uploadMediaForNft: Media Uri is:", mediaUri); // ritorna un link arweave
            //01/07/2024 22:30 mediaUri -> https://arweave.net/fmYQfhu17R2BbdJY1YlhtAW_ENH28dIuH2bMLKE0r8Q
            //return "https://arweave.net/JST16ABDAfrIPmXWiDYzN8Zhxp0s6HPB7tca5vAmsKQ";
            return mediaUri;
            //Il Primo RUN ha prodotto qeusto link
            //https://arweave.net/4y9FwA7Oudx9ZRABYXOSO_6OrlwId6CjyYwAv-ABfOY
            // altro link
            //https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw
        }
        catch (err) {
            console.log("uploadMediaForNft: err:", err);
            return null;
        }
    });
}
exports.default = uploadMediaForNft;
