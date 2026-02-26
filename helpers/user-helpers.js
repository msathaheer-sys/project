var db = require('../config/connections');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

module.exports = {
    doSingup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId);
            });
        });
    },

    dologin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email });
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false });
                    };
                });
            } else {
                resolve({ status: false });
            };
        });
    },

    addToCart: (prodId, userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let userCart = await db.get().collection(collection.CART_COLLECTION)
                    .findOne({ user: new ObjectId(userId) });

                if (userCart) {
                    // Update existing cart
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne(
                            { user: new ObjectId(userId) },
                            { $push: { products: new ObjectId(prodId) } }
                        )
                        .then(() => resolve())
                        .catch(err => reject(err));
                } else {
                    // Create new cart
                    let cartObj = {
                        user: new ObjectId(userId),
                        products: [new ObjectId(prodId)]
                    };
                    db.get().collection(collection.CART_COLLECTION)
                        .insertOne(cartObj)
                        .then(() => resolve())
                        .catch(err => reject(err));
                }
            } catch (err) {
                reject(err);
            }
        });
    },

    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: { user: new ObjectId(userId) }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    let: { prodList: '$products' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$prodList']
                                }
                            }
                        }
                    ]
                    , as: 'cartItems'
                }
            }
            ])
                .toArray()
            resolve(cartItems[0].cartItems)
        })
    }

};