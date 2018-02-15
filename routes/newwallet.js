"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');
var router = express.Router();
router.get('/:accpwd', function (req, res) {
    var newAddress = web3.personal.newAccount(req.params.accpwd);
    res.json({ "address": newAddress });
});
exports.default = router;
//# sourceMappingURL=newwallet.js.map