var db = require('../config/connections');
var collection=require('../config/collections');

module.exports = {
    addProduct: (product, callback) => {
        db.get().collection('Product').insertOne(product).then((data) => {
            callback(data.insertedId);
        });
    },
    getAllProduct:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    }
};
