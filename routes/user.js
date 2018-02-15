"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');
const router = express.Router();
router.get('/', (req, res) => {
    res.send("respond with a resource");
});
exports.default = router;
//# sourceMappingURL=user.js.map