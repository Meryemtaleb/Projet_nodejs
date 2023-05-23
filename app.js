//Express
var express = require('express');
var app = express();

//Dotenv
require('dotenv').config();

//bodyParser*********
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//EJS************
app.set('view engine', 'ejs');

//Method-override 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//Bcrypt************
const bcrypt = require('bcrypt');

//mongodb :****************
var mongoose = require('mongoose');
const url = process.env.DATABASE_URL;

const Produit = require('./models/Produit');
const Users = require('./models/Users');

//connexion à la base de données.
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Mongodb connected !"))
    .catch(err => console.log(err));

//************Les routes*********************/


//Produits***********************
app.get('/newproduit', function (req, res) {
    res.render('Newproduit');
})


app.post('/submitProduit', function (req, res) {
    console.log(req.body);
    const Data = new Produit({
        nom: req.body.nom,
        categories: req.body.categories,
        stock: req.body.stock,
        prix: req.body.prix,
       
    })
    Data.save().then((data) => {
        console.log("Data saved successfully !");
        res.redirect('/allproduits');
    }).catch (err => console.log(err));
});

app.get('/allproduits', function (req, res) {
    Produit.find().then((data) => {
        console.log(data);
        res.render('Allproduits',{ data : data});
    }).catch(err => console.log(err));
})


//Editer
app.get('/produit/:id',function (req,res) {
    Produit.findOne({ _id: req.params.id})
    .then((data) => {res.render('Editproduit',{ data : data});})
    .catch(err => console.log(err));
})
app.put('/produit/edit/:id',function (req,res) {
    const Data = ({
        nom: req.body.nom,
        categories: req.body.categories,
        stock: req.body.stock,
        prix: req.body.prix,
    })
    Produit.updateOne({ _id : req.params.id},{$set : Data})
    .then(data => {
        console.log("Data updated")
        res.redirect('/Allproduits')
    }) .catch(err => console.log(err));
});

//Delete
app.delete('/produit/delete/:id', function (req, res) {
    Produit.findOneAndDelete({ _id: req.params.id })
        .then(data => {
            res.redirect('/Allproduits')
        }).catch(err => console.log(err))
})

//*********Inscription****************
app.post('/api/singup', function (req, res) {
    const Data = new Users({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10),
        admin: false
    })
    Data.save().then((data) => {
        console.log("Users saved !!!");
        res.render('UserPage', { data: data });
        // res.redirect('/Allproduits');
    }).catch(err => console.log(err))
});
app.get('/inscription', function (req, res) {
    res.render('Singup');
})
//*****************Login******************** */
app.get('/login', function (req, res) {
    res.render('Login');
});
app.post('/api/login', function (req, res) {
    Users.findOne({
        username: req.body.username,
    }).then((users) => {
        if (!users) {
            res.send("users not found");
        }
        console.log(users.password);
        if (!bcrypt.compareSync(req.body.password ,users.password)) {
            res.send('invalid password');
        }

        console.log('users found successfully');
        res.redirect('/Allproduits');
    }).catch((err) => { console.log(err) });

});


//server****************************************************************
var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});