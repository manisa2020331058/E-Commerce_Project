const express = require('express');
const { Cart, Product, User, Transaction, Bank, SupplierProduct } = require('../models/model');
const jsPDF = require('jspdf');
const fs = require('fs');
const path = require('path');
const htmlPdf = require('html-pdf');

const router = express.Router();

// Add to Cart
router.post('/add', async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        
        // Verify user exists and is a buyer
        const user = await User.findById(user_id);
        if (!user || (user.user_type !== 'buyer' && user.user_type !== 'user')) {
            return res.status(403).json({ message: 'Unauthorized: Only buyers can add to cart' });
        }

        // Get product details
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if product already in cart
        let cartItem = await Cart.findOne({ user_id, product_id });

        if (cartItem) {
            // Update quantity if product already in cart
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = new Cart({
                user_id,
                product_id,
                product_name: product.name,
                supplier_id: product.supplier_id,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            await cartItem.save();
        }

        res.status(200).json({ 
            message: 'Product added to cart successfully',
            cart: cartItem
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Cart Items
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        
        if (!user || (user.user_type !== 'buyer' && user.user_type !== 'user')) {
            return res.status(403).json({ message: 'Unauthorized: Only buyers can access cart' });
        }
        
        const cartItems = await Cart.find({ user_id: userId });
        res.status(200).json({ carts: cartItems });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Cart Item Quantity
router.patch('/:cartId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartId = req.params.cartId;

        const cartItem = await Cart.findById(cartId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ 
            message: 'Cart updated successfully',
            cart: cartItem
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove Cart Item
router.delete('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const deletedItem = await Cart.findByIdAndDelete(cartId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Checkout
router.post('/checkout', async (req, res) => {
  try {
      const { user_id, address } = req.body;

      // Get user details
      const user = await User.findById(user_id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (!user.account_number) {
          return res.status(400).json({ message: 'Please add bank details first' });
      }

      // Get user's bank details
      const bank = await Bank.findOne({ account_number: user.account_number });
      if (!bank) {
          return res.status(400).json({ message: 'Bank account not found' });
      }

      // Get cart items
      const cartItems = await Cart.find({ user_id });
      if (cartItems.length === 0) {
          return res.status(400).json({ message: 'Cart is empty' });
      }

      // Calculate total amount
      const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      bank.amount -= totalAmount;
      await bank.save();

      // Group items by supplier
      const supplierItems = {};
      for (const item of cartItems) {
          if (!supplierItems[item.supplier_id]) {
              supplierItems[item.supplier_id] = [];
          }
          supplierItems[item.supplier_id].push({
              product_name: item.product_name,
              product_id: item.product_id,
              price: item.price,
              quantity: item.quantity
          });
      }

      // Create supplier orders and handle bank transactions
      for (const [supplierId, items] of Object.entries(supplierItems)) {
        console.log(supplierId)
          // Find the supplier
          const supplier = await User.findById(supplierId);
          if (!supplier || !supplier.account_number) {
              return res.status(400).json({ message: `Bank details not found for supplier ${supplierId}` });
          }

          // Find the supplier's bank account
          const supplierBank = await Bank.findOne({ account_number: supplier.account_number });
          if (!supplierBank) {
              return res.status(400).json({ message: `Bank account not found for supplier ${supplierId}` });
          }

          // Calculate the total credit for this supplier
          const productCredit = items.reduce((total, item) => total + (item.price * item.quantity), 0);

          
          // supplierBank.amount += productCredit;
          // await supplierBank.save();

          // Create supplier order
          const supplierOrder = new SupplierProduct({
              supplier_id: supplierId,
              user_id: user_id,
              product_list: items,
              isVerified: false,
              product_credit: productCredit
          });
          await supplierOrder.save();
      }

      // Create transaction record
      const transaction = new Transaction({
          user_id,
          products: cartItems.map(item => ({
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity,
              price: item.price
          })),
          total_amount: totalAmount,
          address,
          payment_status: 'pending',
          delivery_status: 'pending'
      });

      await transaction.save();

      // Clear cart
      await Cart.deleteMany({ user_id });

      res.status(200).json({
          message: 'Order placed successfully! Waiting for supplier confirmation.',
          transaction_id: transaction._id,
          total_amount: totalAmount
      });
  } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ message: 'Internal server error during checkout' });
  }
});


// Handle supplier order confirmation
router.put('/confirm/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const supplierOrder = await SupplierProduct.findById(orderId);
        
        if (!supplierOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (supplierOrder.isVerified) {
            return res.status(400).json({ message: 'Order already verified' });
        }

        // Get user and supplier bank details
        const user = await User.findById(supplierOrder.user_id);
        const userBank = await Bank.findOne({ account_number: user.account_number });

        if (!userBank) {
            return res.status(400).json({ message: 'Bank account not found' });
        }

        // Calculate total amount
        const orderAmount = supplierOrder.product_list.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        // Check if user has sufficient balance
        if (userBank.amount < orderAmount) {
            return res.status(400).json({ message: 'Insufficient balance in user account' });
        }

        // Process payment - deduct from user
        userBank.amount -= orderAmount;
        await userBank.save();

        // Mark order as verified
        supplierOrder.isVerified = true;
        await supplierOrder.save();

        // Update transaction status
        await Transaction.updateOne(
            { user_id: supplierOrder.user_id },
            { 
                $set: { 
                    payment_status: 'completed',
                    amount_paid: orderAmount,
                    payment_date: new Date()
                }
            }
        );

        res.status(200).json({
            message: 'Order confirmed and payment processed successfully',
            deducted_amount: orderAmount,
            remaining_balance: userBank.amount
        });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;