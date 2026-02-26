var db = require('../config/connections');
var collection = require('../config/collections');
const { ObjectId } = require('mongodb');
const { response } = require('../app');

module.exports = {
    addProduct: (product, callback) => {
        db.get().collection('Product').insertOne(product).then((data) => {
            callback(data.insertedId);
        });
    },
    getAllProduct: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        })
    },
    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: new ObjectId(prodId) }).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    getProductDetails: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new ObjectId(prodId) }).then((product) => {
                resolve(product);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    updateProduct: (prodId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: new ObjectId(prodId) }, {
                $set: {
                    Name: proDetails.Name,
                    Description: proDetails.Description,
                    Price: proDetails.Price,
                    Category: proDetails.Category
                }
            }).then((response) => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
};