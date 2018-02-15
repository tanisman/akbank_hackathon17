import express = require('express');
var Web3 = require('web3');
var akc = require('../Scripts/AkceToken');

const router = express.Router();

declare var web3: any;

router.get('/:pwd/:accountid/:amount', (req: express.Request, res: express.Response) => {
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

export default router;