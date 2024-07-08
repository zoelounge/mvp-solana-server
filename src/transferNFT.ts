import { TokenStandard, mplTokenMetadata, transferV1 } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";



async function transferNft(): Promise<string> {

    console.log("Start async");
    //Use the transferV1 function to transfer the NFT:

    //Create a UMI instance and use the mplTokenMetadata plugin:
    //const umi = createUmi("https://api.devnet.solana.com", "processed")
    const umi = createUmi(process.env.SOLANA_RPC_USE!, "finalized");

    umi.use(mplTokenMetadata());
    //Define the mint address of the NFT, the current owner's signer, and the new owner's public key:

    const mintTo = publicKey("mintToTransfer"); // Replace "mintToTransfer" with the actual mint address
    const currentOwner = generateSigner(umi); // This generates a signer for the current owner
    const newOwner = publicKey("newOwnerPublicKey"); // Replace "newOwnerPublicKey" with the new owner's public key

    await transferV1(umi, {
        mint: mintTo,
        authority: currentOwner,
        tokenOwner: currentOwner.publicKey,
        destinationOwner: newOwner,
        tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi);
    //Ensure you replace "mintToTransfer" and "newOwnerPublicKey" with the actual mint address of the NFT and the public key of the new owner, respectively.
    return "";
};


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


