const router = require("express").Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const listingsRouter = require('./listings.js');
const cartRouter = require('./cart.js');
const checkoutRouter = require('./checkout.js');
const orderRouter = require('./order.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/listings', listingsRouter);

router.use('/cart', cartRouter);

router.use('/checkout', checkoutRouter);

router.use('/order', orderRouter);

module.exports = router;
