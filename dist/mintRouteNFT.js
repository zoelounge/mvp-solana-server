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
const splUploadNFTMetadata_1 = __importDefault(require("./splUploadNFTMetadata"));
const uploadNftMedia_1 = __importDefault(require("./uploadNftMedia"));
const mintNFT_1 = __importDefault(require("./mintNFT"));
// exports.mintRouteNft = function (req: { body: { start: any; }; }, res: any) {
//     console.log('Zoe getMyCalls');
//     //Zoe Style
//     console.log('Zoe getMyCalls');
//     //Zoe Style
//     console.log('  t req.body.start=', req.body.start);
// };
function mintRouteNFTAction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("mintRouteNFTAction()");
        console.log(`mintRouteNFTAction req.body.image_media_name:`, req.body.image_media_name);
        console.log(`mintRouteNFTAction req.body.student:`, req.body.student);
        // console.log(`mintRouteNFTAction req.body.image_media_name:`, req.body.image_media_name);
        //  console.log(`mintRouteNFTAction req.body.student:`, req.body.student);
        //return null;
        try {
            //let image_media_name = "LaureaMasterZSol.pdf";
            let image_media_name = req.body.image_media_name;
            let nft_name = req.body.student.metadata.name;
            // ritorna il link arweave deve è ospitato il nostro Media file in questo caso su irys
            const uriMedia = yield (0, uploadNftMedia_1.default)(image_media_name, nft_name); // ritorna un link arweave
            if (uriMedia === null) {
                console.log("mintRouteNFT: uriMedia problem");
                return null;
            }
            console.log("mintRouteNFT: uriMedia:", uriMedia);
            //invio media_uri e req.body.metadata a uploadNFTMetadata
            const metadataNft = yield (0, splUploadNFTMetadata_1.default)(uriMedia, req.body); // ritorna un link dove sono caricati i metadata del media che useremo per mintare il nostro NFT 
            if (metadataNft === null) {
                console.log("mintRouteNFT: metadataNft problem");
                return null;
            }
            // const signaure = await mintNFT(metadataNft);   // ritorna una signaure
            // return signaure;
            const objResultMintAndTRansfer = yield (0, mintNFT_1.default)(metadataNft);
            return objResultMintAndTRansfer;
        }
        catch (err) {
            console.log(`mintRouteNFT err: ${err}`);
            return null;
        }
    });
}
exports.default = mintRouteNFTAction;
