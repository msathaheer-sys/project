var express = require('express');
const { render } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');

/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getAllProduct().then((products) => {
    res.render('admin/view-products', { admin: true, products });
  });
});

router.get('/add-product', function (req, res) {
  res.render('admin/add-product');
});

router.post('/add-product', (req, res) => {
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.Image;
    console.log(id);
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product');
      } else {
        console.log(err);
      };
    });
  });
});

router.get('/delete-product/:id', (req, res) => {
  let prodId = req.params.id;
  console.log(prodId);
  productHelpers.deleteProduct(prodId).then((response) => {
    res.redirect('/admin/');
  });
});
// router.get('/delete-product/',(req,res)=>{
// let proId=req.query.id;
// console.log(proId);
// console.log(req.query.name);
// })

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id);
  res.render('admin/edit-product', { product });
});

router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id;
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin');
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/product-images/' + id + '.jpg');
    }
  });
});


module.exports = router;