import express = require('express');
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');

const router = express.Router();

declare var web3: any;

router.get('/:accountid/:pwd/:target/:amount', (req: express.Request, res: express.Response) => {
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

export default router;