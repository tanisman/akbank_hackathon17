"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');
var router = express.Router();
router.get('/:addr', function (req, res) {
    if (akc.contract.isMarketAccount.call(req.params.addr)) {
        var data = akc.contract.getMarketData(req.params.addr);
        res.json({ "isMarket": true, "id": data[0], "name": data[1], "type": data[2] });
    }
    else {
        res.json({ "isMarket": false });
    }
});
exports.default = router;
//# sourceMappingURL=marketData.js.map