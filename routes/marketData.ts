import express = require('express');
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');

const router = express.Router();

declare var web3: any;

router.get('/:addr', (req: express.Request, res: express.Response) => {
    if (akc.contract.isMarketAccount.call(req.params.addr)) {
        var data = akc.contract.getMarketData(req.params.addr);
        res.json({ "isMarket": true, "id": data[0], "name": data[1], "type": data[2] });
    } else {
        res.json({ "isMarket": false });
    }
});

export default router;