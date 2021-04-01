require('dotenv').config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yydty.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.yydty.mongodb.net:27017,cluster0-shard-00-01.yydty.mongodb.net:27017,cluster0-shard-00-02.yydty.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-10i9ky-shard-0&authSource=admin&retryWrites=true&w=majority`;


const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Hello Ema John")
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("ordersInfo");

    app.post('/addProducts', (req, res) => {
        const products = req.body
        productsCollection.insertMany(products)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })

    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.post('/orders', (req, res) => {
        const order = req.body
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

});




const PORT = 4000;

app.listen(process.env.PORT || PORT)