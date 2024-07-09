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
const web3_js_1 = require("@solana/web3.js");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
function testRPC() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("testRPC() called");
        try {
            //const rpc_url = "https://api.devnet.solana.com";//process.env.SOLANA_RPC_USE;
            const rpc_url = process.env.SOLANA_RPC_USE;
            console.log("rpc_url = ", rpc_url);
            const umi = (0, umi_bundle_defaults_1.createUmi)(rpc_url, "finalized");
            //console.log("testRPC: umi: ", umi);
            // prendo un wallet che ho gia 
            //const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
            // creo un nuovo wallet
            //const keypair = Keypair.generate();
            const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array([212, 165, 250, 82, 113, 241, 43, 136, 138, 67,
                102, 32, 70, 142, 229, 243, 33, 242, 59, 239,
                143, 18, 12, 203, 203, 195, 5, 189, 65, 232,
                232, 100, 167, 216, 79, 199, 89, 10, 182, 233,
                25, 249, 223, 26, 245, 205, 217, 117, 201, 69,
                156, 131, 233, 180, 142, 225, 147, 141, 222, 175,
                205, 81, 195, 195]));
            console.log("keypair: ", keypair);
            const publicKey = keypair.publicKey.toBase58(); // è l'indirizzo pubblico da usare
            const secretKey = keypair.secretKey.toString(); // Serve a finrmare : non sonon parole ma una serie di numeri
            console.log("PublicKey = ", publicKey);
            console.log("SecretKey = ", secretKey);
            const connection = new web3_js_1.Connection(rpc_url, "confirmed");
            console.log(" testRPC: connnection.rpcEndpoint = ", connection.rpcEndpoint);
            let balance = yield connection.getBalance(keypair.publicKey);
            console.log(`balance: ${balance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
            //test keypairUMI
            // let keypairUmi = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
            // const myKeypairSigner = createSignerFromKeypair(umi, keypairUmi);
            // const umiPublickKey = toWeb3JsPublicKey(myKeypairSigner.publicKey)
            //let balanceUMI = await connection.getBalance(umiPublickKey);
            //console.log(`balanceUMI:  ${balanceUMI / LAMPORTS_PER_SOL} SOL`);
            if ((balance / web3_js_1.LAMPORTS_PER_SOL) == 0) {
                const airdropSignature = yield connection.requestAirdrop(keypair.publicKey, //umiPublickKey, //keypair.publicKey,
                1 * web3_js_1.LAMPORTS_PER_SOL);
                console.log("aidropSignature: ", airdropSignature);
                balance = yield connection.getBalance(keypair.publicKey);
                console.log(`${balance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
                console.log(`Succes: Chek your TX here on Solana Explorer: ${rpc_url}/tx/${airdropSignature}?cluster=devnet`);
            }
            var obj = {
                rpcEndpoint: connection.rpcEndpoint,
                balance: balance / web3_js_1.LAMPORTS_PER_SOL,
                error: "No error"
            };
            return obj;
        }
        catch (err) {
            console.log("testRPC: err:", err);
            var obj = {
                rpcEndpoint: "",
                balance: 0,
                error: err
            };
            return obj;
        }
    });
}
exports.default = testRPC;
