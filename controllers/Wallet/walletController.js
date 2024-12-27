const Wallet = require('../../models/Wallet/walletModel');

const Vendor = require('../../models/Vendor/vendorModel');

exports.createWallet = async (req, res) => {
    try {
        const { userId, userType } = req.body;


        if (!userId || !userType) {
            return res.status(400).json({ message: 'userId and userType are required' });
        }


        let wallet = await Wallet.findOne({ userId });
        if (wallet) {
            return res.status(400).json({ message: 'Wallet already exists for this user' });
        }


        wallet = new Wallet({ userId, userType, balance: 0 });


        await wallet.save();

        res.status(201).json({ message: 'Wallet created successfully', wallet });
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ message: 'Error creating wallet', error: error.message });
    }
};

exports.depositFunds = async (req, res) => {
    try {
        const { userId, amount, paymentMethod } = req.body;

        // Ensure the amount is greater than zero
        if (amount <= 0) {
            return res.status(400).json({ message: 'Deposit amount must be greater than zero' });
        }

        // Ensure a valid payment method is provided
        if (!['Cash', 'Online'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method. Choose either "Cash" or "Online".' });
        }

        // Find the wallet associated with the userId
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for this user' });
        }

        // Update the corresponding balance based on paymentMethod
        if (paymentMethod === 'Online') {
            wallet.onlineBalance += amount;
        } else if (paymentMethod === 'Cash') {
            wallet.cashBalance += amount;
        }

        // Create a new transaction entry
        const newTransaction = {
            type: 'deposit',
            amount,
            paymentMethod,
            balanceAfterTransaction: wallet.cashBalance + wallet.onlineBalance,
        };

        // Add the transaction to the wallet's transaction history
        wallet.transactions.push(newTransaction);

        // Save the updated wallet
        await wallet.save();

        res.status(200).json({ message: 'Funds deposited successfully', wallet });
    } catch (error) {
        console.error('Error depositing funds:', error);
        res.status(500).json({ message: 'Error depositing funds', error: error.message });
    }
};

exports.withdrawFunds = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ message: 'Withdrawal amount must be greater than zero' });
        }

        // Find the wallet associated with the userId
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for this user' });
        }

        if (wallet.cashBalance + wallet.onlineBalance < amount) {
            return res.status(400).json({ message: 'Insufficient funds in wallet' });
        }

        // Update wallet balance (you can deduct from both cash and online balance depending on the requirement)
        if (wallet.onlineBalance >= amount) {
            wallet.onlineBalance -= amount;
        } else {
            const remainingAmount = amount - wallet.onlineBalance;
            wallet.onlineBalance = 0;
            wallet.cashBalance -= remainingAmount;
        }

        // Create a new transaction entry
        const newTransaction = {
            type: 'withdrawal',
            amount,
            paymentMethod: 'Cash', // Can be adjusted based on your withdrawal method
            balanceAfterTransaction: wallet.cashBalance + wallet.onlineBalance,
        };

        // Add the transaction to the wallet's transaction history
        wallet.transactions.push(newTransaction);

        // Save the updated wallet
        await wallet.save();

        res.status(200).json({ message: 'Funds withdrawn successfully', wallet });
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        res.status(500).json({ message: 'Error withdrawing funds', error: error.message });
    }
};

exports.transferFunds = async (req, res) => {
    try {
        const { senderId } = req.params; // Sender's userId from the URL
        const { receiverId, amount } = req.body; // Receiver's userId and amount from the request body

        if (!receiverId || !amount) {
            return res.status(400).json({ message: 'Receiver ID and amount are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Transfer amount must be greater than zero' });
        }

        // Fetch sender's wallet by userId
        const senderWallet = await Wallet.findOne({ userId: senderId });
        if (!senderWallet) {
            return res.status(404).json({ message: 'Sender wallet not found' });
        }

        // Fetch receiver's wallet by userId
        const receiverWallet = await Wallet.findOne({ userId: receiverId });
        if (!receiverWallet) {
            return res.status(404).json({ message: 'Receiver wallet not found' });
        }

        // Ensure sender has sufficient funds
        if (senderWallet.cashBalance + senderWallet.onlineBalance < amount) {
            return res.status(400).json({ message: 'Sender has insufficient funds' });
        }

        // Deduct funds from sender's wallet
        let senderBalanceAfterTransaction;
        if (senderWallet.onlineBalance >= amount) {
            senderWallet.onlineBalance -= amount;
            senderBalanceAfterTransaction = senderWallet.cashBalance + senderWallet.onlineBalance;
        } else {
            const remainingAmount = amount - senderWallet.onlineBalance;
            senderWallet.onlineBalance = 0;
            senderWallet.cashBalance -= remainingAmount;
            senderBalanceAfterTransaction = senderWallet.cashBalance + senderWallet.onlineBalance;
        }

        // Add funds to receiver's wallet
        receiverWallet.onlineBalance += amount;
        const receiverBalanceAfterTransaction = receiverWallet.cashBalance + receiverWallet.onlineBalance;

        // Log receiverId and vendorId for debugging
        console.log('Receiver ID:', receiverId);

        // Fetch receiver's name from Vendor model using _id (not vendorId)
        const receiverVendor = await Vendor.findById(receiverId); // Use findById instead of querying by vendorId
        if (!receiverVendor) {
            console.error(`Receiver with ID ${receiverId} not found in Vendor model.`);
        }

        const receiverName = receiverVendor
            ? `${receiverVendor.firstName} ${receiverVendor.lastName}`
            : 'Unknown User'; // Default to 'Unknown User' if the receiver is not found

        console.log('Receiver Name:', receiverName); // Debugging line

        // Record transaction in sender's wallet
        const senderTransaction = {
            type: 'transfer',
            amount: -amount,
            paymentMethod: 'Wallet',
            balanceAfterTransaction: senderBalanceAfterTransaction,
            description: `Transferred to ${receiverName}`,
            receiverId: receiverId,
            receiverName: receiverName, // Include receiver name in transaction
        };
        senderWallet.transactions.push(senderTransaction);

        // Record transaction in receiver's wallet
        const receiverTransaction = {
            type: 'transfer',
            amount: amount,
            paymentMethod: 'Wallet',
            balanceAfterTransaction: receiverBalanceAfterTransaction,
            description: `Received from user ${senderId}`,
            senderId: senderId, // Include sender ID in transaction
        };
        receiverWallet.transactions.push(receiverTransaction);

        // Save changes to both wallets
        await senderWallet.save();
        await receiverWallet.save();

        res.status(200).json({
            message: 'Funds transferred successfully',
            senderWallet: {
                _id: senderWallet._id,
                balance: senderBalanceAfterTransaction,
                transactions: senderWallet.transactions,
            },
            receiverWallet: {
                _id: receiverWallet._id,
                balance: receiverBalanceAfterTransaction,
                transactions: receiverWallet.transactions,
            },
        });
    } catch (error) {
        console.error('Error transferring funds:', error);
        res.status(500).json({ message: 'Error transferring funds', error: error.message });
    }
};





exports.getTransactionHistory = async (req, res) => {
    try {
        const { _id } = req.params;

        // Find the wallet associated with the userId
        const wallet = await Wallet.findOne({ _id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for this user' });
        }

        // Return the transaction history
        return res.status(200).json({
            message: 'Transaction history fetched successfully',
            transactions: wallet.transactions,
        });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ message: 'Error fetching transaction history', error: error.message });
    }
};

exports.checkBalance = async (req, res) => {
    try {
        const { _id } = req.params;

        if (_id) {
            // Find wallet using _id and populate transactions and receivables
            const wallet = await Wallet.findById(_id)
                .populate('receivables.orderId') // Populating the orderId reference in receivables
                .exec();

            if (!wallet) {
                return res.status(404).json({ message: 'Wallet not found for this user' });
            }

            // Return the full wallet data
            return res.status(200).json({
                message: 'Wallet balance fetched successfully',
                wallet: {
                    _id: wallet._id,
                    userId: wallet.userId,
                    userType: wallet.userType,
                    cashBalance: wallet.cashBalance,
                    onlineBalance: wallet.onlineBalance,
                    payableAmount: wallet.payableAmount,
                    TotalreceivableAmount: wallet.TotalreceivableAmount,
                    receivables: wallet.receivables, // Include receivables
                    transactions: wallet.transactions, // Include transactions
                    createdAt: wallet.createdAt,
                    updatedAt: wallet.updatedAt,
                }
            });
        }

        return res.status(400).json({ message: 'Invalid request. Please provide _id.' });
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        res.status(500).json({ message: 'Error fetching wallet balance', error: error.message });
    }
};



exports.checkUserBalance = async (req, res) => {
    try {
        const { userType } = req.params;

        if (userType) {
            // Find all wallets with the same userType
            const wallets = await Wallet.find({ userType });
            if (!wallets || wallets.length === 0) {
                return res.status(404).json({ message: `No wallets found for userType: ${userType}` });
            }
            return res.status(200).json({ message: 'Wallets balance fetched successfully', wallets });
        }

        return res.status(400).json({ message: 'Invalid request. Please provide userType.' });
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        res.status(500).json({ message: 'Error fetching wallet balance', error: error.message });
    }
};



