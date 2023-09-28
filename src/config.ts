import {ethers} from "ethers"
import process from "process"

export const TINY_HOPS_CONTRACT_ADDR=
"0x9363298F37f1B285f25Add8317137DfC087de369"
export const MODICUM_MOCK_ADDR = 
//"0x9A676e781A523b5d0C0e43731313A708CB607508"
"0x5FbDB2315678afecb367f032d93F642f64180aa3"

const THOPS_RPC_URL = //"http://testnet.lilypadnetwork.org:8545"
"http://testnetv2.arewehotshityet.com:8545"

export const getPrivateKey = () => {
    return process.env.THOPS_PRIVATE_KEY || ""
}

export const getWallet=()=> {
    return new ethers.Wallet(getPrivateKey(), 
    new ethers.JsonRpcProvider(THOPS_RPC_URL || "http://127.0.0.1:8545"))
}
export const getTinyHopAddr=() => {
    return TINY_HOPS_CONTRACT_ADDR
}