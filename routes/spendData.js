"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');
var router = express.Router();
router.get('/:guid', function (req, res) {
    var spent = akc.contract.getSpent.call(req.params.guid);
    res.json({ "from": spent[0], "target": spent[1], "amount": spent[2] });
});
exports.default = router;
//# sourceMappingURL=spendData.js.map