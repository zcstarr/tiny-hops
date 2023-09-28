import {stringToByteStream} from "../src/lib/index"
const str = "hello world {{stepId:1}}";
const params = stringToByteStream(str);

console.log("string",)
console.log("bytes",params)
console.log("hex", Buffer.from(params).toString("hex"))
console.log("hex 0000000000000000000c68656c6c6f20776f726c642000010000000000000001")
