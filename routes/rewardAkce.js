"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');
var router = express.Router();
router.get('/:pwd/:accountid/:amount', function (req, res) {
    try {
        web3.personal.unlockAccount(akc.adminAccount, req.params.pwd);
        var estimate = akc.contract.rewardAkce.estimateGas(req.params.accountid, req.params.amount);
        var tx = akc.contract.rewardAkce(req.params.accountid, req.params.amount, {
            from: akc.adminAccount, to: akc.contractAddress, value: '0x0', gas: estimate, gasPrice: '18000000000'
        });
        res.json({ "result": "success", "tx": tx });
    }
    catch (err) {
        console.log(err);
        res.json({ "result": "error" });
    }
});
exports.default = router;
//# sourceMappingURL=rewardAkce.js.map