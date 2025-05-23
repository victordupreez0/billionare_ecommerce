const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ROUTES
// Getting All Products
router.get ('/', async (req, res) => {
   try{
        const products = await Product.find()
        res.json(products);
   } catch (err) {
    res.status(500).json({ message: err.message });
   }
});


// Getting One Product
router.get ('/:id', getProduct, (req, res) => {

    res.json(res.product);
//    if (!res.product) {
//       return res.status(404).json({ message: 'Product not found' });
//    }
//    res.send(res.product.name);

});


// Creating a Product (with image upload)
router.post ('/', upload.single('image'), async (req, res) => {
   let imageUrl = req.body.imageUrl;
   if (req.file) {
     imageUrl = `/uploads/${req.file.filename}`;
   }
   const product = new Product ({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: imageUrl // Always save the imageUrl to the database
   })

   try{
    const newProduct = await product.save()
    res.status(201).json(newProduct);
   } catch (err) {
    res.status(400).json({ message: err.message });
   }
});


// Updating a Product
router.patch ('/:id', getProduct, async (req, res) => {

    if (req.body.name != null) {
        res.product.name = req.body.name
    }
    if (req.body.price != null) {
        res.product.price = req.body.price
    }
    if (req.body.description != null) {
        res.product.description = req.body.description
    }

    try {
        const updatedProduct = await res.product.save()
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
   
});

// Deleting a Product
router.delete ('/:id', getProduct, async (req, res) => {
    try {
        await res.product.deleteOne();
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


});

// Middelware
async function getProduct(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.product = product
    next()
}

module.exports = router;