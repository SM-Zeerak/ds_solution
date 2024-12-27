// const Wallet = require('../../models/Wallet/walletModel');

// // const logWalletTransaction = async (userId, userType, amount, paymentMethod, description) => {
// //     try {
// //         if (!amount || !paymentMethod) {
// //             console.error('Invalid transaction data: amount or paymentMethod missing');
// //             throw new Error('Transaction data is incomplete');
// //         }

// //         // Declare variables to hold wallet and updated balance
// //         let wallet;
// //         let updatedBalance = 0;
// //         let transactionType = '';

// //         // Check if the user is admin, and use the fixed admin wallet ID directly
// //         if (userType === 'admin') {
// //             const adminWalletId = '676561a4fbb423ecd980c4a9'; // Fixed admin wallet ID
// //             wallet = await Wallet.findById(adminWalletId);
// //         } else {
// //             // Fetch wallet for non-admin user
// //             wallet = await Wallet.findOne({ userId, userType });
// //         }

// //         if (!wallet) {
// //             console.error(`Wallet not found for userId: ${userId}, userType: ${userType}`);
// //             throw new Error('Wallet not found for user');
// //         }

// //         // Determine transaction type and update balance
// //         if (paymentMethod === 'Receivable') {
// //             transactionType = 'deposit';
// //             updatedBalance = wallet.receivableAmount + amount;
// //             wallet.receivableAmount = updatedBalance;
// //         } else if (paymentMethod === 'Cash') {
// //             transactionType = 'deposit';
// //             updatedBalance = wallet.cashBalance + amount;
// //             wallet.cashBalance = updatedBalance;
// //         } else if (paymentMethod === 'Online') {
// //             transactionType = 'deposit';
// //             updatedBalance = wallet.onlineBalance + amount;
// //             wallet.onlineBalance = updatedBalance;
// //         } else {
// //             throw new Error(`Invalid payment method: ${paymentMethod}`);
// //         }

// //         // Add transaction details
// //         const transaction = {
// //             type: transactionType,
// //             amount: amount,
// //             paymentMethod: paymentMethod,
// //             balanceAfterTransaction: updatedBalance,
// //             date: new Date(),
// //             description: description || 'Transaction processed',
// //             userId: userId, // Log userId for reference
// //         };

// //         wallet.transactions.push(transaction);

// //         // Save the wallet with the new transaction
// //         await wallet.save();

// //         console.log('Transaction logged successfully:', transaction);
// //     } catch (error) {
// //         console.error('Error logging wallet transaction:', error.message);
// //         throw new Error('Could not log wallet transaction');
// //     }
// // };



// // module.exports = { logWalletTransaction };  


// const logWalletTransaction = async (userId, userType, amount, paymentMethod, description) => {
//     try {
//         if (!amount || !paymentMethod) {
//             console.error('Invalid transaction data: amount or paymentMethod missing');
//             throw new Error('Transaction data is incomplete');
//         }

//         // Declare variables to hold wallet and updated balance
//         let wallet;
//         let updatedBalance = 0;
//         let transactionType = '';

//         // Check if the user is admin, and use the fixed admin wallet ID directly
//         if (userType === 'admin') {
//             const adminWalletId = '676561a4fbb423ecd980c4a9'; // Fixed admin wallet ID
//             wallet = await Wallet.findById(adminWalletId);
//         } else {
//             // Fetch wallet for non-admin user
//             wallet = await Wallet.findOne({ userId, userType });
//         }

//         if (!wallet) {
//             console.error(`Wallet not found for userId: ${userId}, userType: ${userType}`);
//             throw new Error('Wallet not found for user');
//         }

//         // Determine transaction type and update balance
//         if (paymentMethod === 'Receivable') {
//             transactionType = 'deposit';
            
//             updatedBalance = wallet.receivableAmount + amount;
//             wallet.receivableAmount = updatedBalance;
//         } else if (paymentMethod === 'Cash') {
//             transactionType = 'deposit';
//             updatedBalance = wallet.cashBalance + amount;
//             wallet.cashBalance = updatedBalance;
//         } else if (paymentMethod === 'Online') {
//             transactionType = 'deposit';
//             updatedBalance = wallet.onlineBalance + amount;
//             wallet.onlineBalance = updatedBalance;
//         } else {
//             throw new Error(`Invalid payment method: ${paymentMethod}`);
//         }

//         // Add transaction details
//         const transaction = {
//             type: transactionType,
//             amount: amount,
//             paymentMethod: paymentMethod,
//             balanceAfterTransaction: updatedBalance,
//             date: new Date(),
//             description: description || 'Transaction processed',
//             userId: userId, // Log userId for reference
//         };

//         wallet.transactions.push(transaction);

//         // Save the wallet with the new transaction
//         await wallet.save();

//         console.log('Transaction logged successfully:', transaction);
//     } catch (error) {
//         console.error('Error logging wallet transaction:', error.message);
//         throw new Error('Could not log wallet transaction');
//     }
// };

// module.exports = { logWalletTransaction };

const Wallet = require('../../models/Wallet/walletModel');



const logWalletTransaction = async (userId, userType, amount, paymentMethod, description) => {
    try {
        if (!amount || !paymentMethod) {
            console.error('Invalid transaction data: amount or paymentMethod missing');
            throw new Error('Transaction data is incomplete');
        }

        // Declare variables to hold wallet and updated balance
        let wallet;
        let updatedBalance = 0;
        let transactionType = '';

        // Check if the user is admin, and use the fixed admin wallet ID directly
        if (userType === 'admin') {
            const adminWalletId = '676561a4fbb423ecd980c4a9'; // Fixed admin wallet ID
            wallet = await Wallet.findById(adminWalletId);
        } else {
            // Fetch wallet for non-admin user
            wallet = await Wallet.findOne({ userId, userType });
        }

        if (!wallet) {
            console.error(`Wallet not found for userId: ${userId}, userType: ${userType}`);
            throw new Error('Wallet not found for user');
        }

        // Handle 'user' type transactions
        if (userType === 'user') {
            // No balance update for users, we only log the transaction and manage payableAmount if needed
            if (paymentMethod === 'Receivable') {
                transactionType = 'transfer'; // For user, it's a 'transfer' type
                updatedBalance = wallet.payableAmount + amount;
                wallet.payableAmount = updatedBalance; // Update only the payableAmount for the user
            } else {
                transactionType = 'transfer'; // Log other payment methods for the user as 'transfer'
                updatedBalance = wallet.payableAmount; // No balance update for cash or online for user
            }

            // Log the transaction, even if balance is not updated
            const transaction = {
                type: transactionType,
                amount: amount,
                paymentMethod: paymentMethod, // Log 'Cash' or 'Online' for the user
                balanceAfterTransaction: updatedBalance,
                date: new Date(),
                description: description || 'User transaction processed',
                userId: userId,
            };

            wallet.transactions.push(transaction);
        } else {
            // For admin or other users, handle the full transaction update
            if (paymentMethod === 'Receivable') {
                transactionType = 'deposit';
                updatedBalance = wallet.receivableAmount + amount;
                wallet.receivableAmount = updatedBalance;
            } else if (paymentMethod === 'Cash') {
                transactionType = 'deposit';
                updatedBalance = wallet.cashBalance + amount;
                wallet.cashBalance = updatedBalance;
            } else if (paymentMethod === 'Online') {
                transactionType = 'deposit';
                updatedBalance = wallet.onlineBalance + amount;
                wallet.onlineBalance = updatedBalance;
            } else {
                throw new Error(`Invalid payment method: ${paymentMethod}`);
            }

            // Log the transaction
            const transaction = {
                type: transactionType,
                amount: amount,
                paymentMethod: paymentMethod,
                balanceAfterTransaction: updatedBalance,
                date: new Date(),
                description: description || 'Transaction processed',
                userId: userId,
            };

            wallet.transactions.push(transaction);
        }

        // Save the wallet with the new transaction
        await wallet.save();
        console.log('Transaction logged successfully:', {
            type: transactionType,
            amount: amount,
            paymentMethod: paymentMethod,
            balanceAfterTransaction: updatedBalance,
            date: new Date(),
            description: description || 'Transaction processed',
            userId: userId,
        });
    } catch (error) {
        console.error('Error logging wallet transaction:', error.message);
        throw new Error('Could not log wallet transaction');
    }
};

module.exports = { logWalletTransaction };