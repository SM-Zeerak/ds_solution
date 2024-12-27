const express = require('express');
const { createWallet, depositFunds, withdrawFunds, checkBalance ,checkUserBalance ,getTransactionHistory ,transferFunds} = require('../../controllers/Wallet/walletController');

const router = express.Router();

// Route to create a wallet
router.post('/createWallet', createWallet);

// Route to deposit funds into the wallet
router.post('/depositFunds', depositFunds);

// Route to withdraw funds from the wallet
router.post('/withdrawFunds', withdrawFunds);

router.post('/transferFunds/:senderId', transferFunds);

router.get('/checkBalance/:_id', checkBalance);

router.get('/checkUserBalance/:userType', checkUserBalance);

router.get('/transactionHistory/:_id', getTransactionHistory);

module.exports = router;
