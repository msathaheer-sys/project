var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  };
};

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user;
  productHelper.getAllProduct().then((products) => {
    res.render('user/view-products', { products, user });
  });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('user/login', { 'loginErr': req.session.loginErr });
    req.session.loginErr = false;
  };
});

router.get('/singup', (req, res) => {
  res.render('user/singup');
});

router.post('/singup', (req, res) => {
  userHelpers.doSingup(req.body).then((response) => {
    console.log(response);
  });
});

router.post('/login', (req, res) => {
  userHelpers.dologin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    } else {
      req.session.loginErr = "Invalid Username or Password";
      res.redirect('/login');
    };
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/cart', verifyLogin, (req, res) => {
  res.render('user/cart');
});



module.exports = router;