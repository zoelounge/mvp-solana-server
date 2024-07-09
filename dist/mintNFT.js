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
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
//signerIdentity utlizza su UMI il ostro Wallet come firmatario e lo usa lui di defaults
const umi_1 = require("@metaplex-foundation/umi");
const serializers_1 = require("@metaplex-foundation/umi/serializers");
const key_file_json_1 = __importDefault(require("./key-file.json")); // serve per la fase di test altrimenti verremo limitati
const web3_js_1 = require("@solana/web3.js");
//https://developers.metaplex.com/token-metadata/token-standard
function mintNFT(metadataNft) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("mintNFT()");
        //vedi uploadNftMedia
        //const umi = createUmi("https://api.devnet.solana.com", "finalized");
        const rpc_url = process.env.SOLANA_RPC_USE;
        const umi = (0, umi_bundle_defaults_1.createUmi)(rpc_url, "finalized");
        let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(key_file_json_1.default));
        const myKeypairSigner = (0, umi_1.createSignerFromKeypair)(umi, keypair);
        umi.use((0, umi_1.signerIdentity)(myKeypairSigner)); // chi firma la transazione 
        umi.use((0, mpl_token_metadata_1.mplTokenMetadata)()); // diciamo a UMI di utilizzare l'mplTokenMetadata di metaplex per la creazione degli NFT perchè ci sono altre libreire he le creano come bubble e altre 
        console.log("umi.identity.publicKey = ", umi.identity.publicKey);
        const mint = (0, umi_1.generateSigner)(umi); // crea un signer completamente ramdomico
        const sellerFeeBasisPoints = (0, umi_1.percentAmount)(5, 2); // utlizzate solo per gli NFT e sono le fee in basisPoints sarebbero 500 basicPoint
        try {
            //const uri = "https://arweave.net/4y9FwA7Oudx9ZRABYXOSO_6OrlwId6CjyYwAv-ABfOY"
            //const uri: "https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw",
            console.log("mintNFT: metadataNft: ", metadataNft);
            const name = metadataNft.name;
            const symbol = metadataNft.symbol;
            const uri = metadataNft.imageLink;
            const tx = (0, mpl_token_metadata_1.createNft)(umi, {
                mint: mint,
                name: name,
                uri: uri,
                sellerFeeBasisPoints: sellerFeeBasisPoints,
                symbol: symbol
            });
            console.log("mintNFT: Start tx.sendAndConfirm");
            let result = yield tx.sendAndConfirm(umi);
            const signature = serializers_1.base58.deserialize(result.signature);
            console.log("mintNFT: Signature: ", signature);
            console.log("mintNFT: result.result: ", result.result);
            // al primo run ho ottenuto questo 
            //4QUuQEL7DJmPVkHqeKfWe1XyQdkcLEdZWMBMZZrBaGRKj5Ci8esFVt6LZeeSTmC3XeSkb3Mf6ubR7SoSgwFDVsYZ,
            const asset = yield (0, mpl_token_metadata_1.fetchDigitalAsset)(umi, mint.publicKey);
            console.log("mintNFT: asset: ", asset);
            //*************** START test trasferiennto ad un altro wallet  ********************//
            //*********************************************************************************//
            console.log("transferNft()");
            umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
            //Define the mint address of the NFT, the current owner's signer, and the new owner's public key:
            // creiamo una nuova keypair per trasferire l'NFT mintato
            //const keypairNewOwner = Keypair.generate();
            // prendiamo un keygen che ha almeno 1Sol: prso da /keygen
            const keypairNewOwner = web3_js_1.Keypair.fromSecretKey(new Uint8Array([101, 220, 84, 254, 98, 9, 172, 63, 87, 211, 247, 14, 176, 152, 28, 75, 35, 226, 141, 227, 49, 56, 248, 148, 139, 110, 134, 104, 220, 218, 91, 227, 176, 31, 74, 253, 92, 238, 143, 168, 217, 175, 71, 2, 64, 28, 197, 25, 137, 95, 23, 246, 76, 196, 172, 111, 223, 130, 113, 134, 35, 172, 218, 90]));
            console.log("keypairNewOwner: ", keypairNewOwner);
            let keypairNewOwnerUmi = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(keypairNewOwner.secretKey));
            const newOwnerPublicKeyTo = keypairNewOwner.publicKey.toBase58(); // CrWRxyB5KJHAa93EQfVgkb1n4tZEvmhw67X4pjfrf8Gy: è l'indirizzo pubblico da usare
            const newOwnerSecretKeyTo = keypairNewOwner.secretKey.toString(); // Serve a finrmare : non sonon parole ma una serie di numeri
            console.log("newOwnerPublicKeyTo = ", newOwnerPublicKeyTo);
            console.log("newOwnerSecretKeyTo = ", newOwnerSecretKeyTo);
            //const mintTo = publicKey("mintToTransfer"); // Replace "mintToTransfer" with the actual mint address
            //const mintTo = publicKey(result.signature);
            //const mintTo = mint.publicKey;
            const mintTo = asset.mint.publicKey;
            console.log("mintTo = ", mintTo);
            //const currentOwner = generateSigner(umi); // This generates a signer for the current owner
            //const newOwner = publicKey("newOwnerPublicKey"); // Replace "newOwnerPublicKey" with the new owner's public key
            const destinationOwner = keypairNewOwnerUmi.publicKey;
            console.log("destinationOwner = ", destinationOwner);
            let transferResult = yield (0, mpl_token_metadata_1.transferV1)(umi, {
                mint: mintTo,
                authority: umi.identity,
                tokenOwner: keypair.publicKey,
                destinationOwner: destinationOwner,
                tokenStandard: mpl_token_metadata_1.TokenStandard.NonFungible,
            }).sendAndConfirm(umi);
            //Ensure you replace "mintToTransfer" and "newOwnerPublicKey" with the actual mint address of the NFT and the public key of the new owner, respectively.
            const transferSignature = serializers_1.base58.deserialize(transferResult.signature);
            console.log("RpcConfirmTransactionResult ", transferResult.result);
            console.log("transferSignature: ", transferSignature);
            // al primo run ho ottenuto questo :
            //*************** END test trasferiennto ad un altro wallet  **********************//
            //*********************************************************************************//
            let objResultMintAndTRansfer = {
                signature: signature,
                transferSignature: transferSignature,
                linkSignature: `https://explorer.solana.com/tx/${signature[0]}?cluster=devnet`,
                linkTransfer: `https://explorer.solana.com/tx/${transferSignature[0]}?cluster=devnet`,
            };
            return objResultMintAndTRansfer;
        }
        catch (err) {
            console.log("mintNFT: err:", err);
            return null;
        }
    });
}
exports.default = mintNFT;
