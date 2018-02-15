import express = require('express');
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');

const router = express.Router();

declare var web3: any;

router.get('/:accountid/:pwd', (req: express.Request, res: express.Response) => {
    web3.personal.unlockAccount(req.params.accountid, req.params.pwd);
    var spentIds = akc.contract.getSpents.call({ from: req.params.accountid });
    res.json({ "spents": spentIds });
});

export default router;