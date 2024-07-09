// serve installare UMI con "npm i @metaplex-foundation/umi-bundle-defaults"
// ci permetteranno di creare la nostra prima istanza di UMI
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
//signerIdentity utlizza su UMI il nostro Wallet come firmatario e lo usa lui di defaults
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import fs_p from 'node:fs/promises';
var fs = require('fs');

var path = require('path');

// Utilizziamo IRYS per l'upload del file nft con "npm i metaplex-foundation/umi-uploader-irys"
import { createIrysUploader, irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import wallet from "./key-file.json"; // serve per la fase di test altrimenti verremo limitati
import { toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
//var wallet = require('./key-file.json'); // posso importatrloa hce cosi 


async function uploadMediaForNft(image_media_name: string, nft_name: string): Promise<string | null> {
    console.log("uploadMediaForNft()")

    // come per il classico mint che usavamo const 
    // keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
    // facciamo lo stesso ma con le API di UMI istanziando il nostro umi 
    //const umi = createUmi("https://api.devnet.solana.com", "finalized");
    //const umi = createUmi("http://127.0.0.1:8899", "finalized");
    //const rpc_url = "https://api.devnet.solana.com";//process.env.SOLANA_RPC_USE;
    const rpc_url = process.env.SOLANA_RPC_USE!;
    const umi = createUmi(rpc_url, "finalized");
    console.log("uploadMediaForNft: umi.rpc.getBalance = ", umi.rpc.getBalance);

    // diciamo ad UMI che deve utilizzare irysUploader
    umi.use(irysUploader());

    // il wallet con cui firmo l'upload del file
    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    // diciamo ad UMI che deve usare come signerIdentity il nostro myKeypairSigner in modo che non dobbiamo sempre specificarlo
    umi.use(signerIdentity(myKeypairSigner));
    console.log("uploadMediaForNft: umi use.signerIdentity ok")

    try {
        // test keypairUMI
        const connection = new Connection(rpc_url!, "finalized");
        console.log(" testRPC: onnnection.rpcEndpoint = ", connection.rpcEndpoint);
        const umiPublickKey = toWeb3JsPublicKey(myKeypairSigner.publicKey)

        let balanceUMI = await connection.getBalance(umiPublickKey);
        console.log(`balanceUMI di myKeypairSigner is:  ${balanceUMI / LAMPORTS_PER_SOL} SOL`);

        var dir = './uploads';

        if (!fs.fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        //var filePath = path.join(__dirname, '../asset/LaureaMasterZSol.pdf');
        var filePath = path.join(__dirname, `./uploads/${image_media_name}`);
        const media = await fs_p.readFile(filePath, /*{ encoding: 'utf8' }*/);

        // prendiamo il nostro file image che dovrebbe rapprenstare il nostro NFT
        //const media = await readFile("./nft/nft-scooter.png");
        //const media = await readFile("../asset/LaureaMasterZSol.jpg");

        // trasformaimolo in qualcosa che possiamo uploadare su IRYS
        //const nft_media = createGenericFile(media, "scooter");
        //const nft_media = createGenericFile(media, nft_name); // Funziona ma non vedo il media sull'explorer
        const nft_media = createGenericFile(media, nft_name, { contentType: "image/jpg" });

        // // potremmo usare uri: umi.uploader.upload ma resterebbe per poco su metaplex
        // // usiamo invece irys che resta per sempre sui suoi db decentralizzati 
        const [mediaUri] = await umi.uploader.upload([nft_media]);

        // // ok abbiamo caricato il file e wui troveremo il link per scaricarlo (dobbiamo aggiiunge .png se volgiamo vederlo con preview)
        // // Adesso manca creare l' NFT coon i metadata: creaimo splMetadata.ts e facciamo tutto li
        console.log("uploadMediaForNft: Media Uri is:", mediaUri);// ritorna un link arweave
        //01/07/2024 22:30 mediaUri -> https://arweave.net/fmYQfhu17R2BbdJY1YlhtAW_ENH28dIuH2bMLKE0r8Q
        //return "https://arweave.net/JST16ABDAfrIPmXWiDYzN8Zhxp0s6HPB7tca5vAmsKQ";
        return mediaUri;
        //Il Primo RUN ha prodotto qeusto link
        //https://arweave.net/4y9FwA7Oudx9ZRABYXOSO_6OrlwId6CjyYwAv-ABfOY
        // altro link
        //https://arweave.net/9-0QSzH1RoNq_r7lmH8FOVSO3YN3hd9ECIDYZ2bTupw
    } catch (err) {
        console.log("uploadMediaForNft: err:", err);
        return null;
    }
}

export default uploadMediaForNft;
