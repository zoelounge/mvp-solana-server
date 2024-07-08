
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
//signerIdentity utlizza su UMI il ostro Wallet come firmatario e lo usa lui di defaults
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
//import { publicKey as publicKeySerializer, string } from "@metaplex-foundation/umi/serializers";

// IrysUploader serve per caricare i file png-pdf-o altro su irys
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import wallet from "./key-file.json"; // serve per la fase di test altrimenti verremo limitati
import { DataUploadForMintNFT } from "./mintRouteNFT";



async function uploadNFTMetadata(_mediaUri: string | null, data: DataUploadForMintNFT): Promise<MetadataInterface | null> {
    console.log("uploadNFTMetadata() _mediaUri =", _mediaUri)
    console.log(`mintRouteNFTAction req.body or data:`, data);

    //vedi uploadNftMedia
    //const umi = createUmi("https://api.devnet.solana.com", "finalized");
    const rpc_url = process.env.SOLANA_RPC_USE;
    const umi = createUmi(rpc_url!, "finalized");

    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));   // chi firma la transazione 
    umi.use(irysUploader());                    // Useremo Irys come DataBase per i nsotri file media
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
            external_url: "https://www.dieei.unict.it/",// posso inserire il mio sito di riferimento
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

        const nftUriMetadata = await umi.uploader.uploadJson(metadata);
        console.log("uploadNFTMetadata: nftUriMetadata is:,", nftUriMetadata)
        ////01/07/2024 22:30 nftUriMetadata is:, https://arweave.net/Ni73ulJxe3qWe8ekHJe1VnL52oOkIzMYii8t8RifPNM
        const metadataNft: MetadataInterface = {
            name: metadata.name,
            symbol: metadata.symbol,
            description: metadata.description,
            imageLink: metadata.image,
            nftLinkMetadata: nftUriMetadata
        }
        return metadataNft;
    } catch (err) {
        console.log(`uploadNFTMetadata: err: ${err}`);
        return null;
    }
}


export default uploadNFTMetadata;


export interface MetadataInterface {
    name: string;
    symbol: string;
    description: string;
    imageLink: string | null;
    nftLinkMetadata: string;
}