import express = require('express');
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');

const router = express.Router();

declare var web3: any;

router.get('/:guid', (req: express.Request, res: express.Response) => {
    var spent = akc.contract.getSpent.call(req.params.guid);
    res.json({ "from": spent[0], "target": spent[1], "amount": spent[2] });
});

export default router;