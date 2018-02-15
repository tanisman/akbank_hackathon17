"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');
var router = express.Router();
router.get('/:accountid/:pwd/:target/:amount', function (req, res) {
    try {
        web3.personal.unlockAccount(req.params.accountid, req.params.pwd);
        var estimate = akc.contract.payViaAkce.estimateGas(req.params.target);
        var tx = akc.contract.payViaAkce(req.params.target, {
            from: req.params.accountid, to: akc.contractAddress, value: req.params.amount, gas: estimate, gasPrice: '18000000000'
        });
        res.json({ "result": "success", "tx": tx });
    }
    catch (err) {
        console.log(err);
        res.json({ "result": "error" });
    }
});
exports.default = router;
//# sourceMappingURL=payViaAkce.js.map