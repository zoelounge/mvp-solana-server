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
function keygenAndAirdrop() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("testRPC() called");
        try {
            //const rpc_url = "https://api.devnet.solana.com";//process.env.SOLANA_RPC_USE;
            const rpc_url = process.env.SOLANA_RPC_USE;
            console.log("rpc_url = ", rpc_url);
            // creo un nuovo wallet
            //const keypair = Keypair.generate();  
            const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array([101, 220, 84, 254, 98, 9, 172, 63, 87, 211, 247, 14, 176, 152, 28, 75, 35, 226, 141, 227, 49, 56, 248, 148, 139, 110, 134, 104, 220, 218, 91, 227, 176, 31, 74, 253, 92, 238, 143, 168, 217, 175, 71, 2, 64, 28, 197, 25, 137, 95, 23, 246, 76, 196, 172, 111, 223, 130, 113, 134, 35, 172, 218, 90]));
            console.log("keypair: ", keypair);
            const publicKey = keypair.publicKey.toBase58(); // CrWRxyB5KJHAa93EQfVgkb1n4tZEvmhw67X4pjfrf8Gy è l'indirizzo pubblico da usare
            const secretKey = keypair.secretKey.toString(); // Serve a finrmare : non sonon parole ma una serie di numeri
            console.log("PublicKey = ", publicKey);
            console.log("SecretKey = ", secretKey);
            const connection = new web3_js_1.Connection(rpc_url, "confirmed");
            console.log(" testRPC: connnection.rpcEndpoint = ", connection.rpcEndpoint);
            let balance = yield connection.getBalance(keypair.publicKey);
            console.log(`balance: ${balance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
            // if ((balance / LAMPORTS_PER_SOL) == 0) {
            //     const airdropSignature = await connection.requestAirdrop(
            //         keypair.publicKey,//umiPublickKey, //keypair.publicKey,
            //         1 * LAMPORTS_PER_SOL
            //     );
            //     console.log("aidropSignature: ", airdropSignature);
            //     balance = await connection.getBalance(keypair.publicKey);
            //     console.log(`New balalnce : ${balance / LAMPORTS_PER_SOL} SOL`);
            //     console.log(
            //         `Succes: Chek your TX here on Solana Explorer: ${rpc_url}/tx/${airdropSignature}?cluster=devnet`
            //     );
            // }
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
exports.default = keygenAndAirdrop;
