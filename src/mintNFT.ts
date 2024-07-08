import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createNft, fetchDigitalAsset, mplTokenMetadata, TokenStandard, transferV1 } from "@metaplex-foundation/mpl-token-metadata";

//signerIdentity utlizza su UMI il ostro Wallet come firmatario e lo usa lui di defaults
import { publicKey, createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

import wallet from "./key-file.json"; // serve per la fase di test altrimenti verremo limitati
import { MetadataInterface } from "./splUploadNFTMetadata";
import { Keypair } from "@solana/web3.js";

//https://developers.metaplex.com/token-metadata/token-standard
async function mintNFT(metadataNft: MetadataInterface): Promise<ObjResultMintAndTRansfer | null> {
    console.log("mintNFT()")

    //vedi uploadNftMedia
    //const umi = createUmi("https://api.devnet.solana.com", "finalized");
    const rpc_url = process.env.SOLANA_RPC_USE;
    const umi = createUmi(rpc_url!, "finalized");
    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));   // chi firma la transazione 
    umi.use(mplTokenMetadata());                // diciamo a UMI di utilizzare l'mplTokenMetadata di metaplex per la creazione degli NFT perchè ci sono altre libreire he le creano come bubble e altre 

    console.log("umi.identity.publicKey = ", umi.identity.publicKey)

    const mint = generateSigner(umi); // crea un signer completamente ramdomico
    const sellerFeeBasisPoints = percentAmount(5, 2); // utlizzate solo per gli NFT e sono le fee in basisPoints sarebbero 500 basicPoint


    try {
        //const uri = "https://arweave.net/4y9FwA7Oudx9ZRABYXOSO_6OrlwId6CjyYwAv-ABfOY"
        //const uri: "https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw",
        console.log("mintNFT: metadataNft: ", metadataNft);

        const name = metadataNft.name;
        const symbol = metadataNft.symbol;
        const uri = metadataNft.imageLink!;

        const tx = createNft(
            umi,
            {
                mint: mint,
                name: name,
                uri: uri,
                sellerFeeBasisPoints: sellerFeeBasisPoints,
                symbol: symbol
            }
        );

        console.log("mintNFT: Start tx.sendAndConfirm");

        let result = await tx.sendAndConfirm(umi);
        const signature = base58.deserialize(result.signature);
        console.log("mintNFT: Signature: ", signature);
        console.log("mintNFT: result.result: ", result.result);

        // al primo run ho ottenuto questo 
        //4QUuQEL7DJmPVkHqeKfWe1XyQdkcLEdZWMBMZZrBaGRKj5Ci8esFVt6LZeeSTmC3XeSkb3Mf6ubR7SoSgwFDVsYZ,

        const asset = await fetchDigitalAsset(umi, mint.publicKey)
        console.log("mintNFT: asset: ", asset);

        //*************** START test trasferiennto ad un altro wallet  ********************//
        //*********************************************************************************//
        console.log("transferNft()")

        umi.use(mplTokenMetadata());
        //Define the mint address of the NFT, the current owner's signer, and the new owner's public key:

        // creiamo una nuova keypair per trasferire l'NFT mintato
        //const keypairNewOwner = Keypair.generate();
        // prendiamo un keygen che ha almeno 1Sol: prso da /keygen
        const keypairNewOwner = Keypair.fromSecretKey(new Uint8Array([101, 220, 84, 254, 98, 9, 172, 63, 87, 211, 247, 14, 176, 152, 28, 75, 35, 226, 141, 227, 49, 56, 248, 148, 139, 110, 134, 104, 220, 218, 91, 227, 176, 31, 74, 253, 92, 238, 143, 168, 217, 175, 71, 2, 64, 28, 197, 25, 137, 95, 23, 246, 76, 196, 172, 111, 223, 130, 113, 134, 35, 172, 218, 90]));
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
        const destinationOwner = keypairNewOwnerUmi.publicKey
        console.log("destinationOwner = ", destinationOwner);

        let transferResult = await transferV1(umi, {
            mint: mintTo,
            authority: umi.identity,
            tokenOwner: keypair.publicKey,
            destinationOwner: destinationOwner,
            tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi);
        //Ensure you replace "mintToTransfer" and "newOwnerPublicKey" with the actual mint address of the NFT and the public key of the new owner, respectively.

        const transferSignature = base58.deserialize(transferResult.signature);
        console.log("RpcConfirmTransactionResult ", transferResult.result);

        console.log("transferSignature: ", transferSignature);
        // al primo run ho ottenuto questo :

        //*************** END test trasferiennto ad un altro wallet  **********************//
        //*********************************************************************************//


        let objResultMintAndTRansfer: ObjResultMintAndTRansfer = {
            signature: signature,
            transferSignature: transferSignature,
            linkSignature: `https://explorer.solana.com/tx/${signature[0]}?cluster=devnet`,
            linkTransfer: `https://explorer.solana.com/tx/${transferSignature[0]}?cluster=devnet`,
        }
        return objResultMintAndTRansfer;
    } catch (err) {
        console.log("mintNFT: err:", err);
        return null;
    }
}


export default mintNFT;



export interface ObjResultMintAndTRansfer {
    signature: [string, number];              // la signature del createMint.sendAndConfir
    transferSignature: [string, number];       // la signature del transferV1.sendAndConfir
    linkSignature: string;
    linkTransfer: string;
}