const express = require('express');
const app = express();
const { verifyRole, verifyToken } = require('../middlewares/auth');
const Product = require('../models/product');
const Category = require('../models/category');

app.get('/products', (req, res) => {
    let start = Number(req.query.start || 0);
    let finish = Number(req.query.finish || 0);
    Product.find({ stock: true })
        .skip(start)
        .limit(finish)
        .sort('name')
        .populate('user', 'id name email')
        .populate('category', 'id description')
        .exec((err, productsDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err.errors,
                })
            }
            Product.count({ stock: true }, (err, cont) => {
                return res.json({
                    ok: true,
                    productsDB,
                })
            });
        });
});

app.get('/products/:id', (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, productsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.errors,
            })
        }
        if (!productsDB) {
            return res.status(400).json({
                ok: false,
                message: {
                    err: 'No se encuentra el producto buscado',
                }
            });
        }
        Product.findOne({})
            .populate('user', 'id name email')
            .populate('category', 'id description')
            .exec((err, product) => {
                return res.json({
                    ok: true,
                    product,
                })
            });
    });
});

app.get('/products/search/:term', [verifyToken], (req, res) => {
    let termino = req.params.term;

    let regex = new RegExp(termino, 'i');

    Product.find({ name: regex })
        .populate('user', 'name')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            return res.json({
                ok: true,
                product: productDB,
            })
        });
});

app.post('/products', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        precioUni: body.precio,
        stock: true,
        descripcion: body.descripcion,
        user: req.user._id,
        category: body.category,
    });
    product.save((err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        return res.json({
            ok: true,
            product: productDB,
        })
    });
});

app.put('/products/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let users = {
        name: body.name,
        precioUni: body.precio,
        stock: body.stock,
        descripcion: body.descripcion,
        category: body.category,
    };
    Product.findByIdAndUpdate(id, users, { new: true }, (err, productsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!productsDB) {
            return res.status(400).json({
                ok: false,
                message: {
                    err: 'No se encuentra el producto buscado o error al actualizarlo',
                }
            });
        }
        return res.json({
            ok: true,
            product: productsDB,
        })
    });
});

app.delete('/products/:id', (req, res) => {
    let id = req.params.id;
    Product.findByIdAndRemove(id, (err, borrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!borrado) {
            return res.status(400).json({
                ok: false,
                message: {
                    err: 'No se encuentra el producto a borrar',
                }
            })
        }
        return res.json({
            ok: true,
            producto: borrado,
        })
    });
});

module.exports = app;