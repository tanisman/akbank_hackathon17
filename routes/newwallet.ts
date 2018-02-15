import express = require('express');
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');

const router = express.Router();

declare var web3: any;

router.get('/:accpwd', (req: express.Request, res: express.Response) => {
    var newAddress = web3.personal.newAccount(req.params.accpwd);
    res.json({ "address": newAddress });
});

export default router;