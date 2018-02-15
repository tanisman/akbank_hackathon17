"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');
var router = express.Router();
router.get('/:accountid/:pwd', function (req, res) {
    web3.personal.unlockAccount(req.params.accountid, req.params.pwd);
    var spentIds = akc.contract.getSpents.call({ from: req.params.accountid });
    res.json({ "spents": spentIds });
});
exports.default = router;
//# sourceMappingURL=spents.js.map