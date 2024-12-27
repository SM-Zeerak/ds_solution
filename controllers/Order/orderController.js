const ProductOrder = require('../../models/Orders/orderModel');
const Product = require('../../models/Product/productModel');
const { logWalletTransaction } = require('../../controllers/Order/logWalletTransaction');

// exports.createOrder = async (req, res) => {
//   try {
//     const { userId, products, address, paymentMethod, notes, orderType } = req.body;

//     // Fetch product details to validate and determine product type
//     const productDetails = await Promise.all(
//       products.map(async (product) => {
//         const productData = await Product.findById(product.productId);
//         if (!productData) {
//           throw new Error(`Product with ID ${product.productId} not found.`);
//         }
//         return {
//           ...product,
//           productType: productData.productType,
//           price: productData.price,
//         };
//       })
//     );

//     // Determine if any product has type "OnVisit"
//     const hasOnVisitProduct = productDetails.some((product) => product.productType === 'OnVisit');

//     // Adjust paymentMethod and totalAmount based on product types
//     const adjustedPaymentMethod = hasOnVisitProduct ? 'Receivable' : paymentMethod;
//     const totalAmount = hasOnVisitProduct
//       ? 0
//       : productDetails.reduce((sum, product) => sum + product.price * product.quantity, 0);

//     // Determine orderType
//     // If orderType is provided in the request, use it; otherwise, fall back to 'urgent' or 'receivable'
//     const adjustedOrderType = orderType || (adjustedPaymentMethod === 'receivable' ? 'receivable' : 'urgent');

//     // Validate payment method
//     if (!['Cash', 'Online', 'Receivable'].includes(adjustedPaymentMethod)) {
//       return res.status(400).json({ message: 'Invalid payment method' });
//     }

//     // Create the order
//     const newOrder = new ProductOrder({
//       userId,
//       products: productDetails.map(({ productId, quantity }) => ({ productId, quantity })),
//       totalAmount,
//       address,
//       paymentMethod: adjustedPaymentMethod,
//       notes,
//       orderType: adjustedOrderType,  // Use the adjusted orderType here
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({ message: 'Order created successfully', order: savedOrder });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Error creating order', error: error.message });
//   }
// };


// exports.createOrder = async (req, res) => {
//   try {
//     const { userId, products, address, paymentMethod, notes, orderType } = req.body;

//     const productDetails = await Promise.all(
//       products.map(async (product) => {
//         const productData = await Product.findById(product.productId);
//         if (!productData) {
//           throw new Error(`Product with ID ${product.productId} not found.`);
//         }
//         return {
//           ...product,
//           productType: productData.productType,
//           price: productData.price,
//         };
//       })
//     );

//     const hasOnVisitProduct = productDetails.some((product) => product.productType === 'OnVisit');

//     const adjustedPaymentMethod = hasOnVisitProduct ? 'Receivable' : paymentMethod;
//     const totalAmount = hasOnVisitProduct
//       ? 0
//       : productDetails.reduce((sum, product) => sum + product.price * product.quantity, 0);

//     const adjustedOrderType = orderType || (adjustedPaymentMethod === 'receivable' ? 'receivable' : 'urgent');

//     if (!['Cash', 'Online', 'Receivable'].includes(adjustedPaymentMethod)) {
//       return res.status(400).json({ message: 'Invalid payment method' });
//     }

//     // If the order type is urgent, totalAmount should be equal to paymentAmount and balance should be 0
//     const balanceAmount = adjustedOrderType === 'urgent' ? totalAmount : 0;

//     const newOrder = new ProductOrder({
//       userId,
//       products: productDetails.map(({ productId, quantity }) => ({ productId, quantity })),
//       totalAmount,
//       balanceAmount,
//       address,
//       paymentMethod: adjustedPaymentMethod,
//       notes,
//       orderType: adjustedOrderType,
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({ message: 'Order created successfully', order: savedOrder });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Error creating order', error: error.message });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, address, paymentMethod, notes, orderType } = req.body;

    // Fetch product details and calculate totalAmount
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const productData = await Product.findById(product.productId);
        if (!productData) {
          throw new Error(`Product with ID ${product.productId} not found.`);
        }
        return {
          ...product,
          price: productData.price,
        };
      })
    );

    console.log("Fetched Product Details:", productDetails);

    // Calculate total amount
    const totalAmount = productDetails.reduce((sum, product) => {
      if (!product.price || !product.quantity) {
        console.error("Missing price or quantity for product:", product);
        return sum;
      }
      return sum + product.price * product.quantity;
    }, 0);

    console.log("Calculated totalAmount:", totalAmount);

    // Adjust paymentMethod and orderType
    const adjustedOrderType = orderType || 'urgent';
    let adjustedPaymentMethod = paymentMethod;

    if (adjustedOrderType === 'receivable') {
      adjustedPaymentMethod = 'Receivable';
    }

    console.log("Adjusted PaymentMethod:", adjustedPaymentMethod);
    console.log("Adjusted OrderType:", adjustedOrderType);

    // Handle amounts based on orderType and paymentMethod
    let paymentAmount = 0;
    let balanceAmount = 0;

    if (adjustedOrderType === 'urgent') {
      if (adjustedPaymentMethod === 'Online') {
        paymentAmount = totalAmount;
        balanceAmount = 0;


      } else if (adjustedPaymentMethod === 'Cash') {
        paymentAmount = 0;
        balanceAmount = totalAmount;
      }
    } else if (adjustedOrderType === 'receivable') {
      paymentAmount = 0;
      balanceAmount = 0;
    }

    console.log("Payment Amount:", paymentAmount);
    console.log("Balance Amount:", balanceAmount);

    // Create the order
    const newOrder = new ProductOrder({
      userId,
      products: productDetails.map(({ productId, quantity }) => ({ productId, quantity })),
      totalAmount: adjustedOrderType === 'receivable' ? 0 : totalAmount,
      paymentAmount,
      balanceAmount,
      address,
      paymentMethod: adjustedPaymentMethod,
      notes,
      orderType: adjustedOrderType,
    });

    const savedOrder = await newOrder.save();

    if (adjustedOrderType === 'urgent' && adjustedPaymentMethod === 'Online') {
      try {
        const adminWalletId = '676561a4fbb423ecd980c4a9'; // Admin wallet ID
        await logWalletTransaction(
          adminWalletId,
          'admin',
          paymentAmount,
          'Online',
          `Payment received for Order ID: ${savedOrder._id}`
        );
        console.log("Admin wallet transaction logged for online payment.");
      } catch (transactionError) {
        console.error("Error logging wallet transaction:", transactionError);
        // Optional: You can rollback the order if wallet update fails
        throw new Error('Order created, but wallet transaction failed.');
      }
    }

    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    // Fetch all orders without population
    const orders = await ProductOrder.find();

    // Return the orders
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);  // Log the full error
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};


