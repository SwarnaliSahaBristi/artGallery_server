// encode.js
const fs = require("fs");
const key = fs.readFileSync("/artify-client-d71f6-firebase-adminsdk-fbsvc-95226d59a5.json", "utf8");
const base64 = Buffer.from(key).toString("base64");
console.log(base64);