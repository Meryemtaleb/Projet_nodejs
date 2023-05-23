
const mongoose = require('mongoose');
const produitSchema = mongoose.Schema({
    nom : {type : 'String'},
    categories : {type : 'String'},
    prix : {type : 'Number'},
    stock : {type : 'Number'},
 })
 module.exports = mongoose.model('Produit',produitSchema);