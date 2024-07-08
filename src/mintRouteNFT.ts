import uploadNFTMetadata, { MetadataInterface } from "./splUploadNFTMetadata";
import uploadMediaForNft from "./uploadNftMedia";
import mintNFT, { ObjResultMintAndTRansfer as ObjResultMintAndTransfer } from "./mintNFT";


// exports.mintRouteNft = function (req: { body: { start: any; }; }, res: any) {
//     console.log('Zoe getMyCalls');
//     //Zoe Style
//     console.log('Zoe getMyCalls');
//     //Zoe Style
//     console.log('  t req.body.start=', req.body.start);

// };



async function mintRouteNFTAction(req: { body: DataUploadForMintNFT }, res: any): Promise<ObjResultMintAndTransfer | null> {
    console.log("mintRouteNFTAction()")
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
        const uriMedia = await uploadMediaForNft(image_media_name, nft_name);         // ritorna un link arweave

        if (uriMedia === null) {
            console.log("mintRouteNFT: uriMedia problem")
            return null;
        }
        console.log("mintRouteNFT: uriMedia:", uriMedia)

        //invio media_uri e req.body.metadata a uploadNFTMetadata

        const metadataNft = await uploadNFTMetadata(uriMedia, req.body);   // ritorna un link dove sono caricati i metadata del media che useremo per mintare il nostro NFT 
        if (metadataNft === null) {
            console.log("mintRouteNFT: metadataNft problem")
            return null;
        }

        // const signaure = await mintNFT(metadataNft);   // ritorna una signaure
        // return signaure;

        const objResultMintAndTRansfer = await mintNFT(metadataNft);
        return objResultMintAndTRansfer;

    } catch (err) {
        console.log(`mintRouteNFT err: ${err}`);
        return null;
    }
}

export default mintRouteNFTAction;



// oggetto che mi arriva dal client
export interface DataUploadForMintNFT {
    image_media_name: string;
    image_media_path: string;
    student: Student;
}

export interface Student {
    name: [string, number];              // la signature del createMint.sendAndConfir
    graduationGrade: [string, number];       // la signature del transferV1.sendAndConfir
    solanaAddress: string;
    metadata: Metadata
}


export interface Metadata {
    name: string;               // 
    symbol: string;             // la signature del transferV1.sendAndConfir
    description: string;
    image: string;
    external_url: string;
    type: string;               // "image/jpg"

}