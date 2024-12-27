const ProductOrder = require('../../models/Orders/orderModel');
const Vendor = require('../../models/Vendor/vendorModel');
const Team = require('../../models/Team/teamModel');
const User = require('../../models/User/userModel');
const Wallet = require('../../models/Wallet/walletModel');
const { logWalletTransaction } = require('../../controllers/Order/logWalletTransaction');

//  Cash and Online Method Done

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentAmount, totalAmount, vendorId, teamId, paymentMethod } = req.body;
    const { id } = req.params;

    // Validate required fields for status "Accepted"
    if (status === 'Accepted' && (!vendorId || !teamId)) {
      return res.status(400).json({
        message: '"vendorId" and "teamId" are required when status is "Accepted"',
      });
    }

    // Find the order
    const order = await ProductOrder.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate paymentAmount globally
    if (paymentAmount) {
      if (paymentAmount > order.totalAmount) {
        return res.status(400).json({ message: 'Payment amount cannot exceed the total amount' });
      }
    }

    // Handle status updates
    let paymentProcessed = false;

    // if (status === 'Accepted') {
    //   if (order.orderType === 'urgent' && order.paymentMethod === 'Cash' && paymentAmount) {
    //     // Handle urgent cash payment
    //     const updatedPaymentAmount = (order.paymentAmount || 0) + paymentAmount;
    //     const updatedBalanceAmount = Math.max(order.totalAmount - updatedPaymentAmount, 0);

    //     order.paymentAmount = updatedPaymentAmount;
    //     order.balanceAmount = updatedBalanceAmount;

    //     paymentProcessed = true;
    //   }

    //   if (order.orderType === 'receivable' && order.paymentMethod === 'Receivable' && totalAmount) {
    //     // Handle receivable payment
    //     const updatedPaymentAmount = totalAmount;
    //     const updatedBalanceAmount = totalAmount;

    //     // Update the order's paymentAmount and balanceAmount
    //     order.paymentAmount = updatedPaymentAmount;
    //     order.balanceAmount = updatedBalanceAmount;
    //     order.paymentAmount = 0;

    //     // Ensure the totalAmount is updated correctly
    //     order.totalAmount = totalAmount;

    //     // Update the user's and admin's wallet balances
    //     const userWallet = await Wallet.findOne({ userId: order.userId, userType: 'user' });
    //     const adminWallet = await Wallet.findOne({ userType: 'admin' });

    //     if (!userWallet || !adminWallet) {
    //       return res.status(400).json({ message: 'Wallet not found for user or admin' });
    //     }

    //     // Add the receivable record to the admin's wallet, including balanceAmount and receivableAmount
    //     adminWallet.receivables.push({
    //       orderId: order._id,
    //       totalAmount: order.totalAmount,
    //       userId: order.userId,
    //       balanceAmount: order.balanceAmount, // Add balanceAmount to the list
    //       receivableAmount: order.balanceAmount, // Ensure receivableAmount is equal to balanceAmount
    //     });



    //     // Update the payable amount in the user's wallet and the receivable amount in the admin's wallet
    //     userWallet.payableAmount += totalAmount; // User's payable amount increases
    //     adminWallet.receivableAmount += totalAmount; // Admin's receivable amount increases

    //     const totalReceivableAmount = adminWallet.receivables.reduce((total, receivable) => {
    //       return total + receivable.balanceAmount;
    //     }, 0);

    //     // Update the TotalreceivableAmount field
    //     adminWallet.TotalreceivableAmount = totalReceivableAmount;

    //     // Save the updated wallets
    //     await userWallet.save();
    //     await adminWallet.save();

    //     // Log the receivables list to the console for debugging
    //     console.log("Admin Wallet Receivables: ", adminWallet.receivables);

    //     // Log the receivable details for the order
    //     console.log("Receivable added for Order:", order._id, "Total Amount:", totalAmount, "Balance Amount:", order.balanceAmount);

    //     paymentProcessed = true;
    //   }

    //   // Update vendorId and teamId for Accepted status
    //   order.vendorId = vendorId;
    //   order.teamId = teamId;
    // }

    if (status === 'Accepted') {
      if (order.orderType === 'urgent' && order.paymentMethod === 'Cash' && paymentAmount) {
        // Handle urgent cash payment
        const updatedPaymentAmount = (order.paymentAmount || 0) + paymentAmount;
        const updatedBalanceAmount = Math.max(order.totalAmount - updatedPaymentAmount, 0);
    
        order.paymentAmount = updatedPaymentAmount;
        order.balanceAmount = updatedBalanceAmount;
    
        paymentProcessed = true;
      }
    
      if (order.orderType === 'receivable' && order.paymentMethod === 'Receivable' && totalAmount) {
        // Handle receivable payment
        const updatedPaymentAmount = totalAmount;
        const updatedBalanceAmount = totalAmount;
    
        // Update the order's paymentAmount and balanceAmount
        order.paymentAmount = updatedPaymentAmount;
        order.balanceAmount = updatedBalanceAmount;
        order.paymentAmount = 0;
    
        // Ensure the totalAmount is updated correctly
        order.totalAmount = totalAmount;
    
        // Update the user's and admin's wallet balances
        const userWallet = await Wallet.findOne({ userId: order.userId, userType: 'user' });
        const adminWallet = await Wallet.findOne({ userType: 'admin' });
    
        if (!userWallet || !adminWallet) {
          return res.status(400).json({ message: 'Wallet not found for user or admin' });
        }
    
        // Check if the receivable record already exists for this order
        const existingReceivableIndex = adminWallet.receivables.findIndex(
          receivable => receivable.orderId.toString() === order._id.toString()
        );
    
        if (existingReceivableIndex === -1) {
          // Add the receivable record to the admin's wallet if it doesn't exist
          adminWallet.receivables.push({
            orderId: order._id,
            totalAmount: order.totalAmount,
            userId: order.userId,
            balanceAmount: order.balanceAmount, // Add balanceAmount to the list
            receivableAmount: order.balanceAmount, // Ensure receivableAmount is equal to balanceAmount
          });
    
          // Update the payable amount in the user's wallet and the receivable amount in the admin's wallet
          userWallet.payableAmount += totalAmount; // User's payable amount increases
          adminWallet.receivableAmount += totalAmount; // Admin's receivable amount increases
    
          const totalReceivableAmount = adminWallet.receivables.reduce((total, receivable) => {
            return total + receivable.balanceAmount;
          }, 0);
    
          // Update the TotalreceivableAmount field
          adminWallet.TotalreceivableAmount = totalReceivableAmount;
    
          // Save the updated wallets
          await userWallet.save();
          await adminWallet.save();
    
          // Log the receivables list to the console for debugging
          console.log("Admin Wallet Receivables: ", adminWallet.receivables);
    
          // Log the receivable details for the order
          console.log("Receivable added for Order:", order._id, "Total Amount:", totalAmount, "Balance Amount:", order.balanceAmount);
        } else {
          // Optionally, log or handle the case where the receivable already exists
          console.log(`Receivable for Order ${order._id} already exists in the admin's wallet.`);
        }
    
        paymentProcessed = true;
      }
    
      // Update vendorId and teamId for Accepted status
      order.vendorId = vendorId;
      order.teamId = teamId;
    }
    


    if (status === 'Processing' && paymentAmount) {
      // Process payment for Processing status
      const updatedPaymentAmount = (order.paymentAmount || 0) + paymentAmount;
      const updatedBalanceAmount = Math.max(order.totalAmount - updatedPaymentAmount, 0);

      if (updatedBalanceAmount < 0) {
        return res.status(400).json({
          message: 'Payment amount exceeds the total amount due',
        });
      }

      if (order.orderType === 'receivable' && order.paymentMethod === 'Receivable') {
        // Update the user wallet and admin wallet if orderType is 'receivable' and order.paymentMethod is 'Receivable'
        const userWallet = await Wallet.findOne({ userId: order.userId, userType: 'user' });
        const adminWallet = await Wallet.findOne({ userType: 'admin' });

        if (!userWallet || !adminWallet) {
          return res.status(400).json({ message: 'Wallet not found for user or admin' });
        }

        // Deduct paymentAmount from the user's payable amount and admin's receivable amount
        userWallet.payableAmount -= paymentAmount;  // Decrease the payable amount for the user
        adminWallet.receivableAmount -= paymentAmount;  // Decrease the receivable amount for the admin

        console.log('Updated payable amount for user:', userWallet.payableAmount);
        console.log('Updated receivable amount for admin:', adminWallet.receivableAmount);

        // Update the receivables list in admin wallet
        const receivableIndex = adminWallet.receivables.findIndex(receivable => receivable.orderId.toString() === order._id.toString());

        if (receivableIndex !== -1) {
          // Update the balanceAmount in the receivable list
          adminWallet.receivables[receivableIndex].balanceAmount = updatedBalanceAmount;
          adminWallet.receivables[receivableIndex].receivableAmount = updatedBalanceAmount;  // Ensuring balanceAmount and receivableAmount are the same
        }

        const totalReceivableAmount = adminWallet.receivables.reduce((total, receivable) => {
          return total + receivable.balanceAmount;
        }, 0);

        // Update the TotalreceivableAmount field
        adminWallet.TotalreceivableAmount = totalReceivableAmount;

        // Save the updated wallets
        await adminWallet.save();
        await userWallet.save();
        try {
          await adminWallet.save();
          console.log('Admin Wallet saved successfully');
        } catch (error) {
          console.error('Error saving Admin Wallet:', error);
          return res.status(500).json({ message: 'Error saving admin wallet' });
        }
      }

      // Update order paymentAmount and balanceAmount
      order.paymentAmount = updatedPaymentAmount;
      order.balanceAmount = updatedBalanceAmount;

      paymentProcessed = true;
    }


    if (order.orderType === 'receivable' && order.paymentMethod === 'Receivable' && order.balanceAmount === 0) {
      console.log('Checking balance amount before updating status:', order.balanceAmount);
      if (status === 'Completed' && paymentAmount) {
        // Handle Completed status when balance is 0
        const updatedPaymentAmount = (order.paymentAmount || 0) + paymentAmount;
        const updatedBalanceAmount = Math.max(order.totalAmount - updatedPaymentAmount, 0);

        order.paymentAmount = updatedPaymentAmount;
        order.balanceAmount = updatedBalanceAmount;

        paymentProcessed = false;
        // Only update status if the payment is processed and balance is zero
        if (order.balanceAmount === 0) {
          order.status = 'Completed';
        }
      } else {
        console.log('Cannot update status to Completed because paymentAmount is missing or other conditions are not met.');
      }
    } else {
      // Handle other cases where balanceAmount is not zero
      console.log('Amount before updating status:', order.balanceAmount);
      if (status === 'Completed' && paymentAmount) {
        // Handle Completed status for other cases
        const updatedPaymentAmount = (order.paymentAmount || 0) + paymentAmount;
        const updatedBalanceAmount = order.totalAmount - updatedPaymentAmount;

        console.log('If - Completed status update triggered',updatedPaymentAmount,updatedBalanceAmount);

        order.paymentAmount = updatedPaymentAmount;
        order.balanceAmount = updatedBalanceAmount;
        console.log('AfterIf - Completed status update triggered', order.paymentAmount, order.balanceAmount);
        paymentProcessed = true;
        // Only update status if paymentProcessed is true and balanceAmount is 0
        if (order.balanceAmount === 0) {
          order.status = 'Completed';
        }
      }
    }
    paymentProcessed = true;


    // Ensure the order is saved at the correct point in your logic
    if (paymentProcessed) {
      await order.save();
      console.log('Order updated to Completed');
    } else {
      console.log('Payment processing not completed, order not updated.');
    }




    order.status = status;
    await order.save();


    // // Now log the wallet transaction only after the order is successfully updated
    // if (order.orderType === 'urgent' && order.paymentMethod === 'Cash' ) {
    //   if (paymentProcessed && paymentAmount) {
    //     // Log the payment in the admin wallet
    //     await logWalletTransaction(order.userId, 'admin', paymentAmount, paymentMethod, `${status} payment received`);
      
    //     // Log the payment in the user wallet
    //     await logWalletTransaction(order.userId, 'user', paymentAmount, paymentMethod, `${status} payment made by user`);
    //   }
      
    // } else {
    //   if (paymentProcessed && paymentAmount) {
    //     // Log the payment in the wallet transaction
    //     await logWalletTransaction(order.userId, 'admin', paymentAmount, paymentMethod, `${status} payment received`);

        
    //   }
    // }

    if (paymentProcessed && paymentAmount) {
      // Log the payment in the admin wallet
      await logWalletTransaction(order.userId, 'admin', paymentAmount, paymentMethod, `${status} payment received`);
    
      // Log the payment in the user wallet
      await logWalletTransaction(order.userId, 'user', paymentAmount, paymentMethod, `${status} payment made by user`);
    }


    return res.status(200).json({
      message: 'Order updated successfully',
      order,
    });


  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};