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
Object.defineProperty(exports, "__esModule", { value: true });
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
function transferNft() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Start async");
        //Use the transferV1 function to transfer the NFT:
        //Create a UMI instance and use the mplTokenMetadata plugin:
        //const umi = createUmi("https://api.devnet.solana.com", "processed")
        const umi = (0, umi_bundle_defaults_1.createUmi)(process.env.SOLANA_RPC_USE, "finalized");
        umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
        //Define the mint address of the NFT, the current owner's signer, and the new owner's public key:
        const mintTo = (0, umi_1.publicKey)("mintToTransfer"); // Replace "mintToTransfer" with the actual mint address
        const currentOwner = (0, umi_1.generateSigner)(umi); // This generates a signer for the current owner
        const newOwner = (0, umi_1.publicKey)("newOwnerPublicKey"); // Replace "newOwnerPublicKey" with the new owner's public key
        yield (0, mpl_token_metadata_1.transferV1)(umi, {
            mint: mintTo,
            authority: currentOwner,
            tokenOwner: currentOwner.publicKey,
            destinationOwner: newOwner,
            tokenStandard: mpl_token_metadata_1.TokenStandard.NonFungible,
        }).sendAndConfirm(umi);
        //Ensure you replace "mintToTransfer" and "newOwnerPublicKey" with the actual mint address of the NFT and the public key of the new owner, respectively.
        return "";
    });
}
;
// vedi https://developers.metaplex.com/token-metadata/transfer
// import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// //signerIdentity utlizza su UMI il ostro Wallet come firmatario e lo usa lui di defaults
// import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi";
// import { base58 } from "@metaplex-foundation/umi/serializers";
// import { Keypair } from '@solana/web3.js';
// const umi = createUmi("https://api.devnet.solana.com", "finalized");
// const asset = generateSigner(umi);
// const payer = generateSigner(umi);
// const receiverAccount = Keypair.generate();
// console.log("transferNFT: Receiver Account Public Key:", receiverAccount.publicKey.toString());
// umi.use(signerIdentity(payer));
// // chiamata Async anonima per il transfer
// async function transferNft(mint: Signer,): Promise<string> {
//     console.log("Start async");
//     await transferV1(umi, {
//         mint,
//         authority: currentOwner,
//         tokenOwner: currentOwner.publicKey,
//         destinationOwner: newOwner.publicKey,
//         tokenStandard: TokenStandard.NonFungible,
//     }).sendAndConfirm(umi)
//     // 6. Transfer an asset
//     const recipient = generateSigner(umi);
//     await transferV1(umi, {
//         asset: asset.publicKey,
//         newOwner: recipient.publicKey,
//         collection: collectionAddress.publicKey,
//     }).sendAndConfirm(umi, txConfig);
//     //console.log("tansfer: amount", amount, "from: ", fromAta.toBase58(), "to: ", toAta.toBase58());
//     return "";
// };
