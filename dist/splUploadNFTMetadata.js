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
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
//signerIdentity utlizza su UMI il ostro Wallet come firmatario e lo usa lui di defaults
const umi_1 = require("@metaplex-foundation/umi");
//import { publicKey as publicKeySerializer, string } from "@metaplex-foundation/umi/serializers";
// IrysUploader serve per caricare i file png-pdf-o altro su irys
const umi_uploader_irys_1 = require("@metaplex-foundation/umi-uploader-irys");
const key_file_json_1 = __importDefault(require("./key-file.json")); // serve per la fase di test altrimenti verremo limitati
function uploadNFTMetadata(_mediaUri, data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("uploadNFTMetadata() _mediaUri =", _mediaUri);
        console.log(`mintRouteNFTAction req.body or data:`, data);
        //vedi uploadNftMedia
        //const umi = createUmi("https://api.devnet.solana.com", "finalized");
        const rpc_url = process.env.SOLANA_RPC_USE;
        const umi = (0, umi_bundle_defaults_1.createUmi)(rpc_url, "finalized");
        let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(key_file_json_1.default));
        const myKeypairSigner = (0, umi_1.createSignerFromKeypair)(umi, keypair);
        umi.use((0, umi_1.signerIdentity)(myKeypairSigner)); // chi firma la transazione 
        umi.use((0, umi_uploader_irys_1.irysUploader)()); // Useremo Irys come DataBase per i nsotri file media
        try {
            // dobbiamo creae i metadata del nostro NFT
            // I vari campi dei metadata li abbaimo presi da questo link a metaplex sezine Non Fungibel Standard:
            //https://developers.metaplex.com/token-metadata/token-standard
            const metadata = {
                name: data.student.metadata.name,
                symbol: data.student.metadata.symbol,
                description: data.student.metadata.description,
                //image: "https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw",
                image: _mediaUri,
                attributes: [
                    {
                        trait_type: "Rarity",
                        value: "Common"
                    },
                    {
                        trait_type: "Author",
                        value: "UniSolCert"
                    },
                ],
                //animation_url: "<https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb>",
                external_url: "https://www.dieei.unict.it/", // posso inserire il mio sito di riferimento
                proprietaries: {
                    files: [
                        {
                            //uri: "https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw",
                            uri: _mediaUri,
                            type: "image/jpg"
                        },
                    ],
                    category: "image",
                }
            };
            // const metadata = {
            //     name: "Laurea RML",
            //     symbol: "UNICT",
            //     description: "NFT Laurea RML",
            //     //image: "https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw",
            //     image: _mediaUri,
            //     attributes: [
            //         {
            //             trait_type: "Rarity",
            //             value: "Common"
            //         },
            //         {
            //             trait_type: "Author",
            //             value: "UniSolCert"
            //         },
            //     ],
            //     //animation_url: "<https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb>",
            //     external_url: "https://www.dieei.unict.it/",// posso inserire il mio sito di riferimento
            //     proprietaries: {
            //         files: [
            //             {
            //                 //uri: "https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw",
            //                 uri: _mediaUri,
            //                 type: "image/jpg"
            //             },
            //         ]
            //     }
            // };
            const nftUriMetadata = yield umi.uploader.uploadJson(metadata);
            console.log("uploadNFTMetadata: nftUriMetadata is:,", nftUriMetadata);
            ////01/07/2024 22:30 nftUriMetadata is:, https://arweave.net/Ni73ulJxe3qWe8ekHJe1VnL52oOkIzMYii8t8RifPNM
            const metadataNft = {
                name: metadata.name,
                symbol: metadata.symbol,
                description: metadata.description,
                imageLink: metadata.image,
                nftLinkMetadata: nftUriMetadata
            };
            return metadataNft;
        }
        catch (err) {
            console.log(`uploadNFTMetadata: err: ${err}`);
            return null;
        }
    });
}
exports.default = uploadNFTMetadata;
